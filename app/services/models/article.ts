export default interface Article {
  id: string;
  Title: string;
  Description: string;
  date: Date;
  image: Image;
}

export interface Image {
  id: string;
  url: string;
}
