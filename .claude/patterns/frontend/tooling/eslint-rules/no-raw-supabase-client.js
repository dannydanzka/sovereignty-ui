/**
 * ESLint Rule: no-raw-supabase-client
 *
 * CODE SOVEREIGNTY PRINCIPLE: Clear Borders + Secure Trade
 *
 * ALL Supabase Storage operations MUST go through getStorageClient().
 * Direct imports of raw `supabase` or `supabaseAdmin` clients are forbidden
 * outside of the centralized database module.
 *
 * DETECTED PATTERNS:
 * ❌ import { supabase } from '@database'
 * ❌ import { supabaseAdmin } from '@database'
 * ❌ import { isSupabaseConfigured } from '@database'
 * ❌ import { isSupabaseAdminConfigured } from '@database'
 *
 * ALLOWED:
 * ✅ import { getStorageClient } from '@database'
 * ✅ import { prisma } from '@database'
 * ✅ Raw clients inside database/ module itself
 * ✅ Raw clients inside API routes (/api/) that need fine-grained control
 *
 * WHY:
 * - Prevents using anon key (RLS-restricted) when service role is needed
 * - Centralizes connection logic (fallback, logging, configuration)
 * - Single point of change for auth strategy
 */

export const noRawSupabaseClientRule = {
  create(context) {
    const filename = context.filename || context.getFilename();

    // Allow raw imports inside the database module itself
    if (filename.includes('/infrastructure/database/')) {
      return {};
    }

    // Allow raw imports inside API routes (they handle their own auth checks)
    if (filename.includes('/app/api/')) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        // Only check imports from @database or the supabase client path
        if (source !== '@database' && !source.includes('database/supabase.client')) {
          return;
        }

        const forbiddenNames = [
          'supabase',
          'supabaseAdmin',
          'isSupabaseConfigured',
          'isSupabaseAdminConfigured',
        ];

        for (const specifier of node.specifiers) {
          if (
            specifier.type === 'ImportSpecifier' &&
            forbiddenNames.includes(specifier.imported.name)
          ) {
            context.report({
              data: {
                name: specifier.imported.name,
              },
              message:
                'Do not import raw Supabase client "{{ name }}" directly. ' +
                'Use getStorageClient() from @database for storage operations. ' +
                'Raw clients bypass centralized connection management.',
              node: specifier,
            });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Enforce centralized Supabase storage client usage via getStorageClient()',
      recommended: true,
    },
    schema: [],
    type: 'problem',
  },
};
