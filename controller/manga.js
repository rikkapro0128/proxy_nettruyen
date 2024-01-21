import { load } from "cheerio";
import axios from "axios";

import {
  getContent,
  getStatistical,
  getDetails,
  getChapters,
  isValidURL,
} from "../utils/index.js";

class Manga {
  async getList(req, res, next) {
    try {
      const ls = [];
      const page = req.query.page || 1;

      const content = await getContent(`?page=${page}`);

      if (content == null) {
        throw new Error("Content not found");
      }

      const $ = load(content);
      $("#ctl00_divCenter > div > div > div.items > div.row > div.item").each(
        (index, element) => {
          ls.push({
            src: $(element)
              .find("div.image > a > img")
              .attr("src")
              .split(process.env.NETTRUYEN_URL)[1],
            thumbnail: $(element)
              .find("div.image > a")
              .attr("href")
              .split(process.env.NETTRUYEN_URL)[1],
            statistical: getStatistical(
              $(element).find("div.image > div.view > span").text()
            ),
            name: $(element).find("figcaption a.jtip").text().trim(),
            details: getDetails($(element).find(".message_main > p").toArray()),
          });
        }
      );
      res.status(200).json({
        origin: process.env.NETTRUYEN_URL,
        pagination: {
          at: parseInt(page),
          min: parseInt(
            $("#ctl00_mainContent_ctl00_divPager > ul > li:nth-child(2)")
              .text()
              .trim()
          ),
          max: parseInt(
            $("#ctl00_mainContent_ctl00_divPager > ul > li:nth-last-child(2)")
              .text()
              .trim()
          ),
        },
        body: ls,
      });
    } catch (error) {
      return next(error);
    }
  }

  async bio(req, res, next) {
    try {
      const path = req.body.path;

      if (!path) {
        throw new Error("Path not found");
      }

      const content = await getContent(`${path}`);
      const $ = load(content);

      const bio = {
        name: $("#item-detail > h1").text().trim(),
        thumbnail: $(
          "#item-detail > div.detail-info > div > div.col-xs-4.col-image > img"
        )
          .attr("src")
          .split(process.env.NETTRUYEN_URL)[1],
        last_update: $("#item-detail > time")
          .text()
          .trim()
          .replace(/Cập nhật lúc: |[\[\]]/g, ""),
        details: {
          author: $(
            "#item-detail > div.detail-info > div > div.col-xs-8.col-info > ul > li.author.row > p.col-xs-8"
          )
            .text()
            .trim(),
          status: $(
            "#item-detail > div.detail-info > div > div.col-xs-8.col-info > ul > li.status.row > p.col-xs-8"
          )
            .text()
            .trim(),
          type: $(
            "#item-detail > div.detail-info > div > div.col-xs-8.col-info > ul > li.kind.row > p.col-xs-8"
          )
            .text()
            .split("-")
            .map((s) => s.trim()),
          view_on_net: $(
            "#item-detail > div.detail-info > div > div.col-xs-8.col-info > ul > li:nth-child(4) > p.col-xs-8"
          )
            .text()
            .trim(),
          follow_on_net: $(
            "#item-detail > div.detail-info > div > div.col-xs-8.col-info > div.follow > span > b"
          )
            .text()
            .trim(),
          rate_num_on_net: $(
            "#item-detail > div.detail-info > div > div.col-xs-8.col-info > div.mrt5.mrb10 > span > span:nth-child(3)"
          )
            .text()
            .trim(),
          rate_star_on_net: $(
            "#item-detail > div.detail-info > div > div.col-xs-8.col-info > div.mrt5.mrb10 > span > span:nth-child(1)"
          )
            .text()
            .trim(),
          description: $("#item-detail > div.detail-content > div")
            .text()
            .trim(),
        },
        chapters: getChapters($("#nt_listchapter > nav > ul > li").toArray()),
      };

      res.status(200).json({
        origin: process.env.NETTRUYEN_URL,
        body: bio,
      });
    } catch (error) {
      return next(error);
    }
  }

  async chapter(req, res, next) {
    try {
      const ls = [];
      const path = req.body.path;

      if (!path) {
        throw new Error("Path not found");
      }

      const content = await getContent(`${path}`);

      if (content == null) {
        throw new Error("Content not found");
      }

      const $ = load(content);

      $(
        "#ctl00_divCenter > div.reading > div.reading-detail.box_doc > div.page-chapter > img"
      ).each((index, element) => {
        ls.push($(element).attr("src"));
      });

      res.status(200).json({
        origin: process.env.NETTRUYEN_URL,
        update_at_on_net: $(
          "#ctl00_divCenter > div.reading > div.container > div.top > i"
        )
          .text()
          .trim()
          .replace(/Cập nhật lúc: |[\[\]]/g, ""),
        body: ls,
      });
    } catch (error) {
      return next(error);
    }
  }

  async image(req, res, next) {
    try {
      const path = req.query.path;

      if (!isValidURL(path)) {
        throw new Error("Path invalid");
      }

      if (!path) {
        throw new Error("Path not found");
      }

      const response = await axios({
        url: path,
        method: "GET",
        responseType: "stream",
      });

      response.data.pipe(res);
    } catch (error) {
      res.status(404).end();
    }
  }
}

export default new Manga();
