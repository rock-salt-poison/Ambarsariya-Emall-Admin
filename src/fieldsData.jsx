export const fieldsData = {
    travel_time:[
    {
      id: 1,
      label: "Location",
      name: "location",
      value: "Amritsar",
      type: "text",
    },
    {
      id: 2,
      label: "Airways",
      fields: [
        {
          id: 1,
          label: 'API Key',
          name: 'airways_api',
          type: 'text',
        },
        {
          id: 2,
          label: 'Station Code',
          name: 'airways_station_code',
          type: 'text',
        }
      ]
    },
    {
      id: 3,
      label: "Road Transport",
      fields: [
        {
          id: 1,
          label: 'API Key',
          name: 'bus_api',
          type: 'text',
        },
        {
          id: 2,
          label: 'Station Code',
          name: 'bus_station_code',
          type: 'text',
        }
      ]
    },
    {
      id: 4,
      label: "Railways",
      fields: [
        {
          id: 1,
          label: 'API Key',
          name: 'railways_api',
          type: 'text',
        },
        {
          id: 2,
          label: 'Station Code',
          name: 'railways_station_code',
          type: 'text',
        }
      ]
    },
    {
      id: 5,
      label: "ADVT",
      btn: 'Add',
      fields: [
        {
          id: 1,
          label: 'Select shop',
          name: 'shop_0',
          type: 'select',
          options: ['Shop 1', 'Shop 2']
        },
        {
          id: 2,
          name: 'upload_banner_1',
          type: 'file',
        }
      ]
    },
  ], 
  aqi_api:[
    {
        id: 1,
        label: "Location",
        name: "location",
        value: "Amritsar",
        type: "text",
      },
      {
        id: 2,
        label: "AQI",
        fields: [
          {
            id: 1,
            label: 'API Key',
            name: 'aqi_api',
            type: 'text',
          },
          {
            id: 2,
            label: 'Station Code',
            name: 'aqi_station_code',
            type: 'text',
          }
        ]
      },
    ],
};