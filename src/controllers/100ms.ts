import * as HMS from "@100mslive/server-sdk";

const accessKey = process.env.HMS_ACCESS_KEY;
const secret = process.env.HMS_SECRET;
const hms = new HMS.SDK(accessKey, secret);

export async function startRecording(roomId: string) {
  const params = {};
  try {
    const startRecording = await hms.api.post(`/recordings/room/${roomId}/start`, params);
    return startRecording;
  } catch (error) {
    console.error("Error while starting recording", error)
    throw new Error("Error while starting recording");
  };
}

export async function stopRecording(roomId: string) {
  const params = {};
  try {
    const stopRecording = await hms.api.post(`/recordings/room/${roomId}/stop`, params);
    return stopRecording;
  } catch (error) {
    console.error("Error while ending recording", error)
    throw new Error("Error while ending recording");
  }
};