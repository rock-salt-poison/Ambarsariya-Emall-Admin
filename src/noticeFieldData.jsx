export const noticeFieldData = {
  district_administration: [
    {
      id: 1,
      label: "To : ",
      name: "to",
      type: "text",
      cName:'flex-auto',
      required:true
    },
    {
      id: 2,
      label: "From-To",
      name: "date_range",
      type: "date-range",
      cName:'flex-auto',
      required:true
    },
    {
      id: 3,
      // label: "Image Link",
      name: "img",
      type: "file",
      cName:'flex-auto',
      required:true
    },
    {
      id: 4,
      label: "From :",
      name: "from",
      type: "text",
      cName:'flex-auto',
      required:true
    },
    {
      id: 5,
      label: "Message",
      name: "message",
      type: "message",
      required:true
    },
  ],

  city_events: [
    {
      id: 1,
      label: "From-To",
      name: "date_range",
      type: "date-range",
      cName:'flex-auto',
      required:true

    },
    {
      id: 2,
      label: "Time",
      name: "time",
      type: "time",
      cName:'flex-auto',
      required:true

    },
    {
      id: 3,
      label: "Location",
      name: "location",
      type: "text",
      value: "Amritsar",
      cName:'flex-auto',
      required:true
    },
    {
      id: 4,
      label: "Entry Fee",
      name: "entry_fee",
      type: "number",
      cName:'flex-auto',
      required:true
    },
    {
      id: 5,
      // label: "Image Link",
      name: "img",
      type: "file",
      required:true

    },
    {
      id: 6,
      label: "Message",
      name: "message",
      type: "message",
      required:true

    },
  ],
  ambarsariya_mall_events: [
    {
      id: 1,
      label: "From-To",
      name: "date_range",
      type: "date-range",
      cName:'flex-auto',
      required:true
    },
    {
      id: 2,
      // label: "Image Link",
      name: "img",
      type: "file",
      cName:'flex-auto',
      required:true
    },
    {
      id: 3,
      label: "Shop",
      name: "shop_name",
      type: "select",
      options: [],
      cName:'flex-auto',
      required:true
    },
    {
      id: 4,
      label: "Community",
      name: "community",
      type: "text",
      cName:'flex-auto',
    },
    {
      id: 5,
      label: "Message",
      name: "message",
      type: "message",
      required:true
    },
  ],
  thought_of_the_day: [
    {
      id: 1,
      label: "From-To",
      name: "date_range",
      type: "date-range",
      cName:'flex-auto',
      required:true
    },
    {
      id: 2,
      // label: "Image Link",
      name: "img",
      type: "file",
      required:true
    },
    {
      id: 3,
      label: "Message",
      name: "message",
      type: "message",
      required:true
    },
  ],

  LED_board_display: [
    {
      id: 1,
      label: "Message 1",
      btn: 'Add',
    },    
    {
      id: 2,
      label: "Message",
      name: "message_1",
      type: "text",
    },
  ],
};
