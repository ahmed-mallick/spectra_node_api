const cacheConfig = {
	//max means  // Maximum cached items
	//ttl means expiry
	//updateAgeOnGet Reset TTL on access (frequently used data)
	//Reset TTL on access

	// JWT Token verification cache
	jwt: {
		max: 2000,
		ttl: 5 * 60 * 1000,
		updateAgeOnGet: false,
		allowStale: false,
		name: "jwt-cache",
	},

	clientId: {
		max: 1000,
		ttl: 24 * 60 * 60 * 1000,
		updateAgeOnGet: true,
		allowStale: false,
		name: "client-id-cache",
	},

	appointmentCategories: {
		max: 500,
		ttl: 24 * 60 * 60 * 1000,
		updateAgeOnGet: true,
		allowStale: true,
		name: "appointment-categories-cache",
	},

	branchandCategoryCurrentStatus: {
		max: 200,
		ttl: 10000,
		updateAgeOnGet: true,
		allowStale: true,
		name: "branchandCategoryCurrentStatus",
	},
	getBranchList: {
		max: 200,
		ttl: 24 * 60 * 60 * 1000,
		updateAgeOnGet: true,
		allowStale: true,
		name: "getBranchList",
	},
	getNearestBranchList: {
		max: 200,
		ttl: 24 * 60 * 60 * 1000,
		updateAgeOnGet: true,
		allowStale: true,
		name: "getNearestBranchList",
	},
	getTicketCategories: {
		max: 200,
		ttl: 10000,
		updateAgeOnGet: true,
		allowStale: true,
		name: "getTicketCategories",
	},

	getBranchId: {
		max: 200,
		ttl: 24 * 60 * 60 * 1000,
		updateAgeOnGet: true,
		allowStale: true,
		name: "getBranchId",
	},

	decodeParams: {
		max: 200,
		ttl: 24 * 60 * 60 * 1000,
		updateAgeOnGet: true,
		allowStale: true,
		name: "decodeParams",
	},
	getDisabledDates: {
		max: 200,
		ttl: 24 * 60 * 60 * 1000,
		updateAgeOnGet: true,
		allowStale: true,
		name: "getDisabledDates",
	},
	branchOperators: {
		max: 1000,
		ttl: 24 * 60 * 60 * 1000, // Cache for 24 hours
		updateAgeOnGet: true,
		allowStale: false,
		name: "branchOperators",
	},
	branchCounters: {
		max: 1000,
		ttl: 24 * 60 * 60 * 1000, // Cache for 24 hours
		updateAgeOnGet: true,
		allowStale: false,
		name: "branchCounters",
	},
	getBranchListByCategory: {
		max: 200,
		ttl: 0,
		updateAgeOnGet: false,
		allowStale: false,
		name: "getBranchListByCategory",
	},

	// Default
	default: {
		max: 1000,
		ttl: 15 * 60 * 1000,
		updateAgeOnGet: false,
		allowStale: false,
		name: "default-cache",
	},
};

module.exports = cacheConfig;
