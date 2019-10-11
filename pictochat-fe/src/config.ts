export default {
  urls: {
    FRONTEND_URL_ROOT: process.env.PICTOCHAT_FRONTEND_URL_ROOT || '/'
  },
  discussion: {
    PAGINATION_LIMIT: process.env.DISCUSSION_PAGINATION_LIMIT ? parseInt(process.env.DISCUSSION_PAGINATION_LIMIT) : 10
  }
};
