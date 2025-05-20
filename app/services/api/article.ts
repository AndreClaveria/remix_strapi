import { api } from "./index";
import Article from "../models/article";

export const getArticles = async () => {
  const response = await api.get("/articles/all");
  return response.data;
};

export const getArticle = async (id: string) => {
  const response = await api.get(`/articles/${id}`);
  return response.data;
};

export const createArticle = async (article: Article) => {
  const response = await api.post("/articles", article);
  return response.data;
};

export const updateArticle = async (id: string, article: Article) => {
  const response = await api.put(`/articles/${id}`, article);
  return response.data;
};

export const deleteArticle = async (id: string) => {
  const response = await api.delete(`/articles/${id}`);
  return response.data;
};
