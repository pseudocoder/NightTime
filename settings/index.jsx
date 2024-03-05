import { gettext } from "i18n";

function mySettings(props) {
  return (
    <Page>
      <Section title={<Text bold align="center">Night Time &nbsp; v3.2 &nbsp; by Richard Gee</Text>}>
        <Text align="center">{gettext("donate1")} <Link source="https://paypal.me/richardcgee/2.50chf">{gettext("donate2")}</Link> {gettext("donate3")}</Text>
        <Select
          title = ""
          label = {gettext("dateformat")}
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
            { name: "2018 12 23", value: "yyyy mm dd" },
            { name: "23.12.18", value: "dd.mm.yy" },
            { name: "23/12/18", value: "dd/mm/yy" },
            { name: "23-12-18", value: "dd-mm-yy" },
            { name: "23 12 18", value: "dd mm yy" },
            { name: "12/23/18", value: "mm/dd/yy" },
            { name: "18.12.23", value: "yy.mm.dd" },
            { name: "18/12/23", value: "yy/mm/dd" },
            { name: "18-12-23", value: "yy-mm-dd" },
            { name: "18 12 23", value: "yy mm dd" }
        ]}
        />
        <Select
          title = ""
          label = {gettext("nightstart")}
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
          label = {gettext("nightend")}
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
          settingsKey = "beat"
          label = {gettext("animatedheartbeat")}
        />
        <Toggle
          title = ""
          settingsKey="clickable"
          label = {gettext("clickablestats")}
        />
        <Text>{gettext("daytimetext")}</Text>
        <ColorSelect
          settingsKey="daytext"
          colors={[
            {color: '#ffffff'},
            {color: '#ffff80'},
            {color: '#ff80ff'},
            {color: '#80ffff'},
            {color: '#ffc0c0'},
            {color: '#c0ffc0'}
          ]}
        />
        <Text>{gettext("nighttimetext")}</Text>
        <ColorSelect
          settingsKey="nighttext"
          colors={[
            {color: '#c05020'},
            {color: '#b07010'},
            {color: '#6020b0'},
            {color: '#2050c0'},
            {color: '#c03030'},
            {color: '#50c020'}
          ]}
        />
        <Select
          title = ""
          label = {gettext("statistic") + " 1"}
          settingsKey = "stat1"
          options = {[
            { name: gettext("steps"), value: "steps" },
            { name: gettext("floors"), value: "floors" },
            { name: gettext("calories"), value: "calories" },
            { name: gettext("kilojoules"), value: "kj" },
            { name: gettext("activezoneminutes"), value: "azm" },
            { name: gettext("distancemetres"), value: "dist_m" },
            { name: gettext("distancekm"), value: "dist_km" },
            { name: gettext("distancemiles"), value: "dist_mi" },
            { name: gettext("seconds2"), value: "secs" }
          ]}
        />
        <Select
          title = ""
          label = {gettext("statistic") + " 2"}
          settingsKey = "stat2"
          options = {[
            { name: gettext("steps"), value: "steps" },
            { name: gettext("floors"), value: "floors" },
            { name: gettext("calories"), value: "calories" },
            { name: gettext("kilojoules"), value: "kj" },
            { name: gettext("activezoneminutes"), value: "azm" },
            { name: gettext("distancemetres"), value: "dist_m" },
            { name: gettext("distancekm"), value: "dist_km" },
            { name: gettext("distancemiles"), value: "dist_mi" },
            { name: gettext("seconds2"), value: "secs" }
          ]}
        />
        <Select
          title = ""
          label = {gettext("statistic") + " 3"}
          settingsKey = "stat3"
          options = {[
            { name: gettext("steps"), value: "steps" },
            { name: gettext("floors"), value: "floors" },
            { name: gettext("calories"), value: "calories" },
            { name: gettext("kilojoules"), value: "kj" },
            { name: gettext("activezoneminutes"), value: "azm" },
            { name: gettext("distancemetres"), value: "dist_m" },
            { name: gettext("distancekm"), value: "dist_km" },
            { name: gettext("distancemiles"), value: "dist_mi" },
            { name: gettext("seconds2"), value: "secs" }
          ]}
        />
        <Select
          title = ""
          label = {gettext("statistic") + " 4"}
          settingsKey = "stat4"
          options = {[
            { name: gettext("steps"), value: "steps" },
            { name: gettext("floors"), value: "floors" },
            { name: gettext("calories"), value: "calories" },
            { name: gettext("kilojoules"), value: "kj" },
            { name: gettext("activezoneminutes"), value: "azm" },
            { name: gettext("distancemetres"), value: "dist_m" },
            { name: gettext("distancekm"), value: "dist_km" },
            { name: gettext("distancemiles"), value: "dist_mi" },
            { name: gettext("seconds2"), value: "secs" },
            { name: gettext("none"), value: "" }
          ]}
        />
        <Text>{gettext("help")} <Link source="https://www.pseudocode.ch/fitbit-night-time">https://www.pseudocode.ch/fitbit-night-time</Link></Text>
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
