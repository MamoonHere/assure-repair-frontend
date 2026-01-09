import { K } from "../../constants/constants";

export const googleRestApi = {
  getRoute: async (body) => {
    const response = await fetch(K.EndPoints.Google.GET_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": K.GoogleMaps.apiKey,
        "X-Goog-FieldMask":
          "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
      },
      body: JSON.stringify(body),
    });
    return response.json();
  },
};
