/**
 * Route Permissions Configuration
 * 
 * Define which user types can access each route.
 * 
 * Options:
 * - public: true → accessible without authentication
 * - allowedTypes: ["*"] → all authenticated user types can access
 * - allowedTypes: ["admin", "manager"] → only specific types can access
 * 
 * To restrict a route in the future, change ["*"] to specific types:
 *   allowedTypes: ["admin"]
 * 
 * Routes not listed here will require authentication but allow all types.
 */

export const routePermissions = {
    "/": {
        allowedTypes: ["*"],
    },
    "/signin": {
        public: true,
    },
    "/users": {
        allowedTypes: ["*"],
    },
    "/users/:userId": {
        allowedTypes: ["*"],
    },
};

/**
 * Check if a route is public (no auth required)
 */
export function isPublicRoute(pathname) {
    const permission = matchRoute(pathname);
    return permission?.public === true;
}

/**
 * Check if a user type is allowed to access a route
 */
export function isAllowedForType(pathname, userType) {
    const permission = matchRoute(pathname);

    // If no permission defined, require auth but allow all types
    if (!permission) return true;

    // Public routes are always allowed
    if (permission.public) return true;

    // Check allowedTypes
    if (!permission.allowedTypes) return true;

    // "*" means all types
    if (permission.allowedTypes.includes("*")) return true;

    return permission.allowedTypes.includes(userType);
}

/**
 * Match a pathname to a route permission config.
 * Supports dynamic segments like :userId
 */
function matchRoute(pathname) {
    // Exact match first
    if (routePermissions[pathname]) {
        return routePermissions[pathname];
    }

    // Try pattern matching for dynamic routes
    for (const [pattern, permission] of Object.entries(routePermissions)) {
        const regex = new RegExp(
            "^" + pattern.replace(/:[^/]+/g, "[^/]+") + "$"
        );
        if (regex.test(pathname)) {
            return permission;
        }
    }

    return null;
}
