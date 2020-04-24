require('dotenv').config();

import axios from 'axios';

export async function zoomScheduleMeeting(): Promise<any> {
  try {
    const zoomResponse = await axios('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ZOOM_JWT}`,
        'Content-Type': 'application/json',
      },
      data: {
        topic: 'Meeting with doctor',
        password: process.env.DEFAULT_ZOOM_MEETING_PASSWORD,
        settings: {
          join_before_host: true,
          enforce_login: false,
          meeting_authentication: false,
          waiting_room: false,
        },
      },
    });
    return zoomResponse.data;
  } catch (error) {
    return { error: error.response.data };
  }
}
