import exp from "constants";
import { IPost } from "./store/postSlice"
import { User } from "./store/userSlice"

export interface Client {
    rubick: number;
    address: string | null;
    age: number;
    avatar: string | null;
    client_roles_id: number;
    created_at: string | null;
    districts_id: number | null;
    email: string;
    id: number;
    image: string;
    name: string;
    phone: string | null;
    school: string | null;
    score: number | null;
    status: string | null;
    updated_at: string | null;
}

export interface Contest {
    announce_results_date: string;
    description: string;
    end_date: string;
    id: number;
    name: string;
    participants: any[];
    prizes: any[];
    short_description: string;
    source: string;
    start_date: string;
    status: number;
}

export interface Participant {
    id: number;

}

export interface ContestPivot {
    contest_id: number;
    client_id: number;
}

export interface ContestUser {
    id: number;
    name: string;
    start_date: string;
    announce_results_date: string;
    short_description: string;
    description: string;
    prizes: any[];
    source: string;
    created_at: string;
    updated_at: string;
    pivot: ContestPivot;
}

export interface News {
    id: number;
    sectionName: string;
    title: string;
    imagePreviewResized: string;
    createdAt: string;
    publishDate: string;
    tags: string;
    url: string;
}

export interface NewsBack {
    id: number;
    caption: string;
    title: string;
    short_description: string;
    full_content: string;
    date: string;
    images: string[];
    likes_count: number;
    comments: string[]
}

export interface Clubs {
  id: number
  name: string;
  source: string
  caption: string;
  created_by: {
    id: number
    name: string
    surname: string
  }
  short_description: string;
  age: number;
  description: string;
  clients_count: number;
  clients: User[];
  events: any[];
  posts: IPost[]
}

export interface TrainingVideo {
    id: number;
    name: string;
    source: string;
    description: string;
    created_at: string;
    updated_at: string
}

export interface TrainingImage {
    id: number;
    name: string;
    type: number;
    source: string;
    description: string;
    created_at: string;
    updated_at: string
}

export interface Sport {
    training_videos: TrainingVideo[];
    healthy_eating_video: TrainingVideo[];
    healthy_eating_img: TrainingImage[];
}

export interface Student {
    id: number,
    title: string;
    imagePreviewResized: string;
}

export interface Coach {
    id: number,
    title: string;
    imagePreviewResized: string;
}

export interface Post {
    id: number;
    title: string;
    description: string;
    source: string[];
    clients_id: number;
    created_at: string;
    updated_at: string;
    likes_count: number;
}

type Photo  = {
    id: number;
    imagePreview: string;
    imagePreviewResized: string;
}

export interface PhotoGallery {
    id: number;
    sectionName: string;
    title: string;
    imagePreviewResized: string;
    createdAt: string;
    publishDate: string;
    tags: string;
    photos: Photo[];
}

export interface IComment {
    avatar: string | null;
    id: number;
    text: string;
    created_at: string;
    created_by: number;
    liked_by: number[];
    likes_count: number;
    child: IComment[];
    name: string;
}
