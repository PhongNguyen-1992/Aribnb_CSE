export interface UserFromServer {
    id:       number;
    name:     string;
    email:    string;
    password: string;
    phone:    string;
    birthday: string;
    avatar:   string;
    gender:   boolean;
    role:     string;
}
export interface Content {
    pageIndex: number;
    pageSize:  number;
    totalRow:  number;
    keywords:  null;
    data:      UserFromServer[];
}