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
    
  ], 
  advt:[
    {
      id: 1,
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
    support_page_header_famous_areas: [
      {
        id: 1,
        label: "Area 1",
        btn: 'Add',
        groupNumber: 1,
      },    
      {
        id: 2,
        label: "Enter a famous area or market",
        name: "area_1",
        type: "address",
        groupNumber: 1,
        required:true
      },
      {
        id: 3,
        label: "Radius To (in km)",
        name: "radius_to_1",
        type: "number",
        groupNumber: 1,
        cName:'flex-auto',
        required:true
      },
      {
        id: 4,
        label: "Radius From (in km)",
        name: "radius_from_1",
        type: "number",
        groupNumber: 1,
        cName:'flex-auto',
        required:true
      },
      {
        id: 5,
        label: "Enter name of the area",
        name: "area_name_1",
        type: "text",
        groupNumber: 1,
        required:true
      },
      {
        id: 6,
        // label: "Upload background image",
        name: "bg_img_1",
        type: "file",
        groupNumber: 1,
        required:true
      },
    ],
};