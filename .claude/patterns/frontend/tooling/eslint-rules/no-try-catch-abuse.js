/**
 * ESLint Rule: no-try-catch-abuse
 *
 * PHILOSOPHY (Context7 Aligned):
 * - Try-catch is for EXCEPTIONAL cases, NOT normal flow control
 * - Promises with {success, error} patterns DON'T need try-catch
 * - Focus on ERROR HANDLING QUALITY, not blocking try-catch usage
 * - EVERY catch block MUST use logger OR error handler OR UI state management
 * - Nested try-catch is a code smell (except error boundaries)
 *
 * KEY PRINCIPLE (Context7):
 * - logError() = OBSERVABILITY (for monitoring/debugging)
 * - throw = CONTROL FLOW (for caller to handle)
 * - Both are needed, they serve different purposes
 *
 * CONTEXT7 - 3 VALID PATTERNS ONLY:
 *
 * 1. UI Components: catch (err) { setError(err.message); }
 *    - State management MANDATORY
 *
 * 2. Utils/Helpers:
 *    - Validations: throw directly (NO try-catch)
 *    - Operations that fail: catch (error) { logError(error, 'fn'); throw error; }
 *
 * 3. Use Cases: catch (error) { return handleUseCaseError(error, 'useCaseName'); }
 *    - Wrapper pattern MANDATORY
 *
 * CONTEXT7 EXCEPTIONS (No try-catch needed):
 * - Promises with .success pattern: const result = await fn(); if (!result.success) logError(...)
 * - Email operations: Already handle errors internally, return {success, error}
 * - Test cleanup: catch { } without parameter is OK
 *
 * ENFORCES:
 * 1. Catch blocks MUST have REAL error handling (logging, UI state, or handler call)
 * 2. NO nested try-catch (code smell - refactor to single level)
 * 3. NO silent catch blocks (catch without any handling)
 * 4. NO empty catch blocks with error parameter
 * 5. Re-throw wrappers MUST have logging BEFORE throw (logError + throw)
 * 6. Context-aware handlers: API routes → handleApiError, Use Cases → handleUseCaseError, Components → UI state
 *
 * INVALID PATTERNS:
 * - Silent catch with return default (hides error from caller):
 *   catch (error) { logError(error, 'fn'); return defaultValue; }
 *
 * - Re-throw wrapper without logging (no observability):
 *   catch (e) { throw new Error(msg); }
 *
 * - Empty catch with parameter:
 *   catch (error) { (empty block) }
 *
 * DOES NOT:
 * - Block try-catch in specific file types (Use Cases, Repositories, etc.)
 * - Dictate WHERE to use try-catch (developer decision based on Context7)
 * - Require try-catch for promises with {success, error} pattern
 *
 * @reviewed 2025-10-29
 * @aligned Context7 Clean Architecture
 */

/** @type {import('eslint').Rule.RuleModule} */
export const noTryCatchAbuseRule = {
  create: (context) => {
    const filename = context.filename || context.getFilename();
    const sourceCode = context.sourceCode || context.getSourceCode();

    // Skip test files, mocks, seeds, scripts
    const isExemptFile =
      /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(filename) ||
      /\/(mocks|__mocks__|seeds|scripts)\//.test(filename) ||
      /\/testing\//.test(filename);

    if (isExemptFile) {
      return {};
    }

    // Detect file context
    const isApiRoute = /\/api\/.*\/route\.(ts|js)$/.test(filename);
    const isUseCase = /\/use-cases\/.*\.use-case\.(ts|js)$/.test(filename);
    const isRepository = /\/repositories\/.*\.repository\.(ts|js)$/.test(filename);
    const isComponent = /\/(components|presentation|app)\/.*\.(tsx|jsx)$/.test(filename);
    const isHook = /\/(hooks|use[A-Z]).*\.(ts|tsx)$/.test(filename);
    const isUtility = /\/(utils|helpers|shared)\/.*\.(ts|js)$/.test(filename);

    /**
     * Get expected handlers based on file context
     */
    const getExpectedHandlers = () => {
      const handlers = [
        'logError',
        'handleError',
        'console.error', // Dev logging
        'console.warn', // Dev logging (allowed by no-console config)
        'process.stderr.write', // Alternative logging
      ];

      if (isApiRoute) {
        handlers.push('handleApiError', 'createErrorResponse');
      }
      if (isUseCase) {
        handlers.push('handleUseCaseError', 'createValidationError', 'createAuthorizationError');
      }
      if (isRepository) {
        handlers.push('handleRepositoryError', 'handleAuthError');
      }
      if (isComponent || isHook) {
        handlers.push('handleComponentError', 'setError', 'setState', 'setLoading', 'setIsLoading');
      }

      return handlers;
    };

    /**
     * Check if catch block has proper error handling
     *
     * CONTEXT7 ALIGNED - 3 Valid Patterns:
     * 1. UI Components: setError() mandatory
     * 2. Utils/Helpers: logError + throw (or just throw for validations)
     * 3. Use Cases: handleUseCaseError
     */
    const hasProperErrorHandling = (catchClause) => {
      const bodyText = sourceCode.getText(catchClause.body);
      const expectedHandlers = getExpectedHandlers();

      // CONTEXT7 EXCEPTION 1: Promise patterns with .success check
      // If await returns {success, error}, try-catch is OPTIONAL
      // Example: const result = await sendEmail(); if (!result.success) logError(...)
      const hasPromiseSuccessPattern = /\.success\s*[)}\]]/.test(bodyText);

      // CONTEXT7 EXCEPTION 2: Email optional operations
      // sendEmail functions already handle errors internally
      const isEmailOperation = /send\w*Email/.test(bodyText);

      // Check 1: Logger or handler calls (REAL error handling)
      const hasLoggerOrHandler = expectedHandlers.some((handler) => bodyText.includes(handler));

      // Check 2: UI state management (components/hooks) - CONTEXT7 Pattern 1
      const hasUIStateManagement =
        (isComponent || isHook) && /set[A-Z]\w*\s*\(/.test(bodyText);

      // Check 3: Re-throw detection - CONTEXT7 Pattern 2
      const hasReThrow = /throw\s+(new\s+)?Error/.test(bodyText);

      // Check 4: Return statement with error handling - CONTEXT7 Pattern 3
      const hasErrorReturn =
        /return\s+(handleApiError|handleUseCaseError|handleRepositoryError|NextResponse\.json)/.test(
          bodyText
        );

      // VALID PATTERNS (Context7 aligned):
      // 1. Has logger/handler call → VALID
      // 2. Has UI state management (components/hooks) → VALID (Pattern 1)
      // 3. Has error return (Use Cases) → VALID (Pattern 3)
      // 4. Re-throw WITH logger → VALID (Pattern 2)
      // 5. Promise with success check → VALID (no try-catch needed)
      // 6. Email operations → VALID (handled internally)
      // 7. Has re-throw WITHOUT logger → INVALID (silent wrapper)
      // 8. Empty body → INVALID (handled separately)

      // Context7 exceptions - allow without strict validation
      if (hasPromiseSuccessPattern || isEmailOperation) {
        return true;
      }

      if (hasReThrow) {
        // Re-throw is ONLY valid if logger exists (Context7 Pattern 2)
        return hasLoggerOrHandler;
      }

      return hasLoggerOrHandler || hasUIStateManagement || hasErrorReturn;
    };

    /**
     * Check for nested try-catch
     */
    const hasNestedTryCatch = (node) => {
      let hasNested = false;

      const checkNode = (currentNode) => {
        if (currentNode.type === 'TryStatement' && currentNode !== node) {
          hasNested = true;
        }
        if (currentNode.body && Array.isArray(currentNode.body)) {
          currentNode.body.forEach(checkNode);
        }
        if (currentNode.consequent) {
          checkNode(currentNode.consequent);
        }
        if (currentNode.alternate) {
          checkNode(currentNode.alternate);
        }
      };

      if (node.block && node.block.body) {
        node.block.body.forEach(checkNode);
      }

      return hasNested;
    };

    return {
      TryStatement: (node) => {
        // Check 1: Nested try-catch (CODE SMELL - should be refactored)
        if (hasNestedTryCatch(node)) {
          context.report({
            message:
              'Nested try-catch blocks are a code smell. Consider refactoring to single level with proper error handling for better readability.',
            node,
          });
          // Note: This is a warning-level issue, not blocking
        }

        // Check 2: Catch block must have proper error handling (MANDATORY)
        if (node.handler) {
          const hasProperHandling = hasProperErrorHandling(node.handler);

          if (!hasProperHandling) {
            const bodyText = sourceCode.getText(node.handler.body);
            const hasReThrow = /throw\s+(new\s+)?Error/.test(bodyText);

            let message = 'Catch block must have proper error handling. ';

            if (hasReThrow) {
              message +=
                'Re-throw wrappers without logging are forbidden. Add logError() or console.error() before re-throwing.';
            } else if (isComponent || isHook) {
              message +=
                'Expected: logger call (logError, console.error) OR UI state management (setError, setState).';
            } else if (isUtility) {
              message +=
                'Utility functions should not use try-catch for validation. Remove try-catch and let errors propagate naturally.';
            } else {
              const expectedHandlers = getExpectedHandlers();
              const handlersText = expectedHandlers.join(', ');
              message += `Expected: ${handlersText}. Silent catch blocks are forbidden.`;
            }

            context.report({
              message,
              node: node.handler,
            });
          }
        }

        // Check 3: Empty catch block with parameter (FORBIDDEN)
        if (node.handler && node.handler.body.body.length === 0) {
          if (node.handler.param) {
            context.report({
              message:
                'Empty catch block with error parameter is forbidden. Either log the error or use parameterless catch block.',
              node: node.handler,
            });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        'Enforce error handling quality: require loggers/handlers in catch blocks, detect nested try-catch code smell, forbid silent catches',
      recommended: true,
    },
    messages: {
      nestedTryCatch:
        'Nested try-catch blocks are a code smell. Consider refactoring to single level with proper error handling for better readability.',
      noProperHandler:
        'Catch block must call a logger or error handler. Expected: {{handlers}}. Silent catch blocks are forbidden.',
      emptyCatch:
        'Empty catch block with error parameter is forbidden. Either log the error or use parameterless catch block.',
    },
    schema: [],
    type: 'problem',
  },
};
