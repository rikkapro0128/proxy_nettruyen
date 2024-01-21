import axios from "axios";

const getContent = (path) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${process.env.NETTRUYEN_URL}/${path}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
        console.log(error.message);
        resolve(null);
      });
  });
};

const getStatistical = (message) => {
  const payload = message.split(" ");
  return {
    view: payload[2],
    comment: payload[4],
    like: payload[6],
  };
};

const getDetails = (ls) => {
  return {
    name_other: ls[0].children[2].data.trim(),
    type: ls[1].children[2].data.trim().split(","),
    status: ls[2].children[2].data.trim(),
    net_update_at: ls[6].children[2].data.trim(),
  };
};

const getChapters = (ls) => {
  return ls.map((chapter) => {
    const ctx = chapter.children;
    return {
      chapter: ctx[1].children[1].children[0].data,
      src: ctx[1].children[1].attribs.href.split(process.env.NETTRUYEN_URL)[1],
      update_at: chapter.children[3].children[0].data,
    };
  });
};

const isValidURL = (url) => {
  return url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  )
    ? true
    : false;
};

export {
  getContent,
  getStatistical,
  getDetails,
  getChapters,
  isValidURL,
};
