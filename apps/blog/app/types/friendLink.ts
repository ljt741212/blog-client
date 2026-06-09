export interface FriendLink {
  id: number;
  name: string;
  url: string;
  description?: string;
  avatar?: string;
  sort: number;
  status: number;
}

export interface ApplyFriendLinkDto {
  name: string;
  url: string;
  description?: string;
  avatar?: string;
}
