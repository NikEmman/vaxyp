import {
  defaultData,
  months,
  days,
  defaultAstynomikos,
} from "./defaultData.js";

export const getData = () => {
  const localStorageData = JSON.parse(localStorage.getItem("dataObject"));
  return localStorageData ? localStorageData : defaultData;
};
export function getAnakritikoiSelection() {
  const localStorageData = JSON.parse(localStorage.getItem("anakr"));
  return localStorageData ? localStorageData : { aAnakr: 0, bAnakr: 1 };
}

export const getState = (localData, todayDate) => {
  const stringYear = todayDate.getFullYear();
  const stringMonth = String(todayDate.getMonth() + 1).padStart(2, "0");
  const stringDay = String(todayDate.getDate()).padStart(2, "0");
  const formattedDate = `${stringYear}-${stringMonth}-${stringDay}`;
  const specificDate = new Date(formattedDate);
  const aAnakrSex = localData.anakrSex
    ? localData.anakrSex[getAnakritikoiSelection().aAnakr]
    : "Άντρας";
  const bAnakrSex = localData.anakrSex
    ? localData.anakrSex[getAnakritikoiSelection().bAnakr]
    : "Άντρας";
  const dataObject = {
    victim: "",
    suspect: "",
    vehicle: "",
    formattedDate: `${stringDay}-${stringMonth}-${stringYear}`,
    dayName: days[specificDate.getDay()],
    year: todayDate.getFullYear(),
    month: months[todayDate.getMonth()],
    day: todayDate.getDate(),
    victimData: {},
    ypoptosData: {},
    timePassed: 0,
    apolesthen: "",
    protokolo: "",
    protokoloEndo: "",
    apodexetai: "",
    enMeri: "",
    astynomikoi: [],
    aAnakrSex: aAnakrSex,
    bAnakrSex: bAnakrSex,
    astynomikos: defaultAstynomikos,
  };

  Object.assign(dataObject, { ...localData });
  return dataObject;
};
export function saveData(currentData, newObject) {
  const mergedData = Object.assign({ ...currentData }, { ...newObject });
  localStorage.setItem("dataObject", JSON.stringify(mergedData));
}
