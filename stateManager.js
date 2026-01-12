import { defaultData, months, days } from "./defaultData.js";

export const getData = () => {
  const localStorageData = JSON.parse(localStorage.getItem("dataObject"));
  return localStorageData ? localStorageData : defaultData;
};

export const getState = (localData, todayDate) => {
  let stringYear = todayDate.getFullYear();
  let stringMonth = String(todayDate.getMonth() + 1).padStart(2, "0");
  let stringDay = String(todayDate.getDate()).padStart(2, "0");
  let formattedDate = `${stringYear}-${stringMonth}-${stringDay}`;
  let specificDate = new Date(formattedDate);

  let dataObject = {
    victim: "",
    suspect: "",
    vehicle: "",
    formattedDate: `${stringDay}-${stringMonth}-${stringYear}`,
    dayName: days[specificDate.getDay()],
    year: todayDate.getFullYear(),
    month: months[todayDate.getMonth()],
    day: todayDate.getDate(),
    ypefthiniData: {},
    ypoptosData: {},
    timePassed: 0,
    apolesthen: "",
    protokolo: "",
    protokoloEndo: "",
    apodexetai: "",
    enMeri: "",
    astynomikoi: [],
  };

  Object.assign(dataObject, { ...localData });
  return dataObject;
};
export function saveData(currentData, newObject) {
  const mergedData = Object.assign({ ...currentData }, { ...newObject });
  localStorage.setItem("dataObject", JSON.stringify(mergedData));
}

export function getAnakritikoiSelection() {
  const localStorageData = JSON.parse(localStorage.getItem("anakr"));
  return localStorageData ? localStorageData : { aAnakr: 0, bAnakr: 1 };
}
