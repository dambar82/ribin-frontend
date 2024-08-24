import React, { useState, useEffect } from "react";
import styles from "./NewsPage.module.scss";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchContests } from "../../store/contestSlice";

import Grid from "../../components/Grid/Grid";
import NewsCard from "../../components/NewsCard/NewsCard";

import { News } from "../../types";
import { fetchNewsAndNewsBack } from "../../store/newsSlice";

const NewsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { status, news } = useSelector((state: RootState) => state.news);

  useEffect(() => {
    dispatch(fetchNewsAndNewsBack());
  }, [dispatch]);

  return (
    <div className="page">
      <div className={`${styles.hero} hero`}>
        <img
          src="images/hero-news-bg.png"
          className={`${styles.hero__bg} hero__bg`}
          alt=""
        />
        <img
          src="images/hero-news-ruby.png"
          className={`${styles.hero__ruby} hero__ruby`}
          alt=""
        />
        <h1 className={`${styles.hero__title} hero__title`}>Новости</h1>
      </div>
      <div className="section">
        <div className="section__header">
          <div className="section__title">Все новости</div>
          <div className="section__counter">{news.length}</div>
        </div>
        <div className={"gridElements section__body"}>
          <Grid totalItems={news.length}>
            {news.map((newsItem) => {
              if ("imagePreviewResized" in newsItem) {
                return (
                  <Link key={newsItem.id} to={`/news/api/${newsItem.id}`}>
                    <NewsCard
                      title={newsItem.title}
                      date={newsItem.publishDate}
                      image={newsItem.imagePreviewResized}
                      newsBack={false}
                    />
                  </Link>
                );
              } else {
                return (
                  <Link key={newsItem.id} to={`/news/${newsItem.id}`}>
                    <NewsCard
                      date={newsItem.date}
                      image={newsItem.images[0]}
                      title={newsItem.title}
                      key={newsItem.id}
                      newsBack={true}
                    />
                  </Link>
                );
              }
            })}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
