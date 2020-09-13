"use strict";

import base from "./base.js";

// const urlAPI = "https://api.alarstudios.com/api/";

const refs = {
  listPeople: document.getElementById("listPeople"),
  submit: document.querySelector(".cardСreator"),
};

refs.submit.addEventListener("submit", handleCreateCard);
refs.listPeople.addEventListener("click", handleButtonCard);

const app = {
  items: base, // backend

  // fetch method GET
  get() {
    this.items.map((cardInfo) => this.renderCard(cardInfo));
  },

  // fetch  method POST
  async add(cardInfo) {
    this.items.push(cardInfo);
    app.renderCard(cardInfo);
    // try {
    //   const response = await fetch(urlAPI, {
    //     method: "POST",
    //     body: JSON.stringify(cardInfo),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   const json = await response.json();
    //   app.renderCard(cardInfo);
    // } catch (error) {
    //   this.showNotification("Ошибка сервера");
    // }
  },

  // fetch method DEL
  delete(id) {
    this.items = this.items.filter((item) => item.id !== id);
  },

  // fetch method PUT
  edit(cardInfo) {
    this.items = this.items.map((item) => {
      if (item.id === cardInfo.id) {
        return cardInfo;
      } else {
        return item;
      }
    });
  },

  buildCardPeople(cardInfo) {
    return `
    <tr id="${cardInfo.id}" class="card">
      <td class="card-name">${cardInfo.name}</td>
      <td class="card-tel">${cardInfo.tel}</td>
      <td>
        <button class="buttonCard buttonCard__edit">Редактировать</button>
        <button class="buttonCard buttonCard__del">Стереть</button>
      </td>
    </tr>`;
  },

  buildCardEdit(cardInfo) {
    return `
    <tr id="${cardInfo.id}" class="card">
      <td class="card-name"><input class="edit-input edit-input__name" placeholder="Имя" value="${cardInfo.name}"/></td>
      <td class="card-tel"><input class="edit-input edit-input__tel" placeholder="Телефон" value="${cardInfo.tel}"/></td>
      <td>
        <button class="buttonCard buttonCard__save">Сохранить</button>
        <button class="buttonCard buttonCard__del">Стереть</button>
      </td>
    </tr>`;
  },

  renderCard(cardInfo) {
    const cardPeople = this.buildCardPeople(cardInfo);
    refs.listPeople.insertAdjacentHTML("beforeend", cardPeople);
  },

  validation({ name, tel }) {
    if (name) {
      let regepx = /^[+]{0,1}[-/0-9]*$/g;
      if (
        tel.match(regepx) &&
        !tel.includes("--") &&
        !tel.includes("+-") &&
        tel[0] !== "-" &&
        tel.slice(-1) !== "-"
      ) {
        return true;
      } else {
        this.showNotification("Не корректно введен номер");
        return false;
      }
    } else {
      this.showNotification("Заполните все поля");
      return false;
    }
  },

  showNotification(text) {
    let notification = document.createElement("div");

    notification.className = "notification";

    notification.innerHTML = text;
    document.body.append(notification);

    setTimeout(() => notification.remove(), 1500);
  },

  start() {
    this.get();
  },
};

app.start();

function handleCreateCard(e) {
  e.preventDefault();
  const cardInfo = {
    id: Date.now(),
    name: e.currentTarget.elements.name.value,
    tel: e.currentTarget.elements.tel.value,
  };

  if (app.validation(cardInfo)) {
    app.add(cardInfo);
    e.currentTarget.reset();
  }
}

function handleButtonCard(e) {
  if (e.target.nodeName !== "BUTTON") {
    return;
  }
  const changeCard = e.target.closest(".card");

  if (e.target.closest(".buttonCard__del")) {
    app.delete(Number(changeCard.id));
    changeCard.remove();
  } else if (e.target.closest(".buttonCard__edit")) {
    const inputName = changeCard.querySelector(".card-name").textContent;
    const inputTel = changeCard.querySelector(".card-tel").textContent;

    const cardInfo = {
      id: changeCard.id,
      name: inputName,
      tel: inputTel,
    };

    changeCard.innerHTML = app.buildCardEdit(cardInfo);
  } else if (e.target.closest(".buttonCard__save")) {
    const inputName = changeCard.querySelector(".edit-input__name").value;
    const inputTel = changeCard.querySelector(".edit-input__tel").value;

    const cardInfo = {
      id: changeCard.id,
      name: inputName,
      tel: inputTel,
    };

    if (app.validation(cardInfo)) {
      changeCard.innerHTML = app.buildCardPeople(cardInfo);
      app.edit(cardInfo);
    }
  }
}
