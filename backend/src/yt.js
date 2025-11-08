const { ytIdFromUrl } = require("./utils");
const { fetchVideoDetails, fetchTopComments } = require("./yt_helpers");
const { getSummariesForVideoBatch } = require("./openAi");
const { writeResultsToSheet } = require("./sheets");

async function processVideosHandler({ videoUrls }) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const videos = [];

  for (const url of videoUrls.slice(0, 10)) {
    const id = ytIdFromUrl(url);
    const details = await fetchVideoDetails(id, apiKey);
    const comments = await fetchTopComments(id, apiKey);

    videos.push({
      url,
      title: details.snippet.title,
      description: details.snippet.description,
      views: details.statistics.viewCount,
      likes: details.statistics.likeCount,
      commentsCount: details.statistics.commentCount
    });
  }

  const results = await getSummariesForVideoBatch(videos);
  await writeResultsToSheet(results);
  return results;
}

module.exports = { processVideosHandler };
