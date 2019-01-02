function mySettings(props) {
  return (
    <Page>
      <Select
        title = ""
        label = "Date Format"
        settingsKey = "datefmt"
        options = {[
          { name: "23.12.2018", value: "dd.mm.yyyy" },
          { name: "23/12/2018", value: "dd/mm/yyyy" },
          { name: "23-12-2018", value: "dd-mm-yyyy" },
          { name: "23 12 2018", value: "dd mm yyyy" },
          { name: "12/23/2018", value: "mm/dd/yyyy" },
          { name: "2018.12.23", value: "yyyy.mm.dd" },
          { name: "2018/12/23", value: "yyyy/mm/dd" },
          { name: "2018-12-23", value: "yyyy-mm-dd" },
          { name: "2018 12 23", value: "yyyy mm dd" }
      ]}
      />
      <Select
        title = ""
        label = "Night Start"
        settingsKey = "start"
        options = {[
          { name: "00:00" },
          { name: "01:00" },
          { name: "02:00" },
          { name: "03:00" },
          { name: "04:00" },
          { name: "05:00" },
          { name: "06:00" },
          { name: "07:00" },
          { name: "08:00" },
          { name: "09:00" },
          { name: "10:00" },
          { name: "11:00" },
          { name: "12:00" },
          { name: "13:00" },
          { name: "14:00" },
          { name: "15:00" },
          { name: "16:00" },
          { name: "17:00" },
          { name: "18:00" },
          { name: "19:00" },
          { name: "20:00" },
          { name: "21:00" },
          { name: "22:00" },
          { name: "23:00" },
        ]}
      />
      <Select
        title = ""
        label = "Night End"
        settingsKey = "end"
        options = {[
          { name: "00:00" },
          { name: "01:00" },
          { name: "02:00" },
          { name: "03:00" },
          { name: "04:00" },
          { name: "05:00" },
          { name: "06:00" },
          { name: "07:00" },
          { name: "08:00" },
          { name: "09:00" },
          { name: "10:00" },
          { name: "11:00" },
          { name: "12:00" },
          { name: "13:00" },
          { name: "14:00" },
          { name: "15:00" },
          { name: "16:00" },
          { name: "17:00" },
          { name: "18:00" },
          { name: "19:00" },
          { name: "20:00" },
          { name: "21:00" },
          { name: "22:00" },
          { name: "23:00" },
        ]}
      />
      <Toggle
        title = ""
        settingsKey="beat"
        label="Animated Heartbeat"
      />
    </Page>
  );
}

registerSettingsPage(mySettings);
