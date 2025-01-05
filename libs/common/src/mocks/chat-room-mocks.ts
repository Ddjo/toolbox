import { IChatRoom } from "../types";

export const chatRoomsMock: IChatRoom[] = [
    {
        "_id":  "6776965ab3d9540faeeb3007",
        "name": "",
        "members": [
          {
            _id: "676eaa99f339e85b48452f92",
            email: "email-mock-1@test.test"
          },
          {
            _id: "676eaa4ff339e85b48452f84",
            email: "email-mock-2@test.test"
          }
        ],
        "messages": [
        ],
        "createdAt": new Date("2025-01-02T13:36:26.756Z"),
        "updatedAt": new Date("2025-01-02T14:55:18.894Z"),
        totalMessages: 0
      }
]

