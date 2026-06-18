'use server';

import YouTubeVideoId from 'get-youtube-id';
import { asc, count, eq, ilike } from 'drizzle-orm';
import { lyrics, lyricsToReciter, lyricsToTopic, lyricsToWriter, reciter, topic, writer } from '@/db/schema';
import { dataType, ModelName } from './types';
import { db } from '@/db';

export const getVideoData = async (videoUrl: string) => {
	try {
		const videoId = YouTubeVideoId(videoUrl) as string;

		const url = `https://yt-api.p.rapidapi.com/video/info?id=${videoId}`;
		const options = {
			method: 'GET',
			headers: {
				'x-rapidapi-key': 'b0e5892221msh00c1065eee6f480p178acfjsna850f9150860',
				'x-rapidapi-host': 'yt-api.p.rapidapi.com',
			},
		};

		const videoresponse = await fetch(url, options);
		if (!videoresponse.ok) {
			return { success: false, message: `Ivalid URL or Yt Res is not Ok` };
		}

		const result: any = await videoresponse.json();

		return {
			success: true,
			message: `Data Fetched`,
			thumbnails: result.thumbnail,
			uploadDate: result.publishDate,
			reciterName: result.channelTitle.toLowerCase(),
			title: result.title,
			videoId,
		};
	} catch (error: any) {
		console.log(error);
		return { success: false, message: `Something went wrong ${error.message}` };
	}
};

export const getItems = async (model: ModelName, query = ''): Promise<dataType[]> => {
	try {
		const configMap = {
			reciter: {
				table: reciter,
				nameColumn: reciter.name,
				idColumn: reciter.id,
				joinTable: lyricsToReciter,
				joinOn: eq(reciter.id, lyricsToReciter.reciterId),
			},
			writer: {
				table: writer,
				nameColumn: writer.name,
				idColumn: writer.id,
				joinTable: lyricsToWriter,
				joinOn: eq(writer.id, lyricsToWriter.writerId),
			},
			topic: {
				table: topic,
				nameColumn: topic.name,
				idColumn: topic.id,
				joinTable: lyricsToTopic,
				joinOn: eq(topic.id, lyricsToTopic.topicId),
			},
		} as const;

		const config = configMap[model];
		if (!config) return [];

		const data = await db
			.select({
				id: config.idColumn,
				name: config.nameColumn,
				count: count(lyrics.id),
			})
			.from(config.table)
			.leftJoin(config.joinTable, config.joinOn)
			.leftJoin(lyrics, eq(config.joinTable.lyricsId, lyrics.id))
			.where(ilike(config.nameColumn, `%${query}%`))
			.groupBy(config.idColumn)
			.orderBy(asc(config.nameColumn));

		return data;
	} catch (error) {
		console.error(error);
		return [];
	}
};
