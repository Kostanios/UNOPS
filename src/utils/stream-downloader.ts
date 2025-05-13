import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import * as StreamArray from 'stream-json/streamers/StreamArray';

export const streamDownloader = async <T>(read: Readable, processBatch: (...args: any[]) => Promise<any>, batchSize) => {
  const jsonStream = StreamArray.withParser();

  let batch: (T)[] = [];

  const processing = async () => {
    for await (const { value } of jsonStream) {
      batch.push(value);

      if (batch.length >= batchSize) {
        await processBatch(batch);
        batch = [];
      }
    }

    if (batch.length > 0) {
      await processBatch(batch);
    }
  };

  await Promise.all([
    pipeline(read, jsonStream),
    processing(),
  ]);
}
