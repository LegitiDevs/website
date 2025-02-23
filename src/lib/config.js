export const SITE_CONFIG = {
	API_ROOT: "https://api.legitimoose.net/", // PROD: "https://api.legitimoose.net"
	SITE_ROOT: "https://legitimoose.net/", // PROD: "https://legitimoose.net/"
	MCAUTH: {
		CLIENT_ID: "3547577294300120212", // PROD: 3547577294300120212
		REDIRECT_URI: "https://legitimoose.net/profile/login",
	},
};

export const STATUS_CHECKING_CONFIG = {
	MILLISECONDS_TIL_NEXT_FETCH: 900000, // 15min = 900000ms
	API_WARNING_TIME: 5000, // Time until status checker states that API status is 1 (warning)
	DEFAULT_CONTENT: { api: [], scraper: [] },
	MAX_LENGTH_UNTIL_DATA_REMOVAL: 100,
};