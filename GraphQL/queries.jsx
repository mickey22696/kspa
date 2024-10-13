// Central File to store all the used Queries for GraphQL
import { gql } from '@apollo/client';

export const GET_PRODS_INDEX = gql`
    query GetCategory {
        realServicesConnection {
            groupBy {
                ServiceCategory {
                    key
                }
            }
        }
    }
`;
export const get_kingsley_homep = gql`
    query {
        kingsleyIsOn {
            Gifts
            Kingsley_Home
            Kingsley
        }
    }
`;

export const GET_PRODS = gql`
    query getService($ServiceCategory: String!) {
        realServices(
            where: { ServiceCategory: $ServiceCategory }
            sort: "updated_at:desc"
        ) {
            id
            Promotion
            ServiceCategory
            ServiceSubcategory
            ServiceName
            ServiceDesc
            slug
            Promotion
            promoDesc
            localizations {
                locale
                ServiceName
                ServiceDesc
            }
            ServiceImage {
                url
            }
            Room {
                Room
            }
            ServicePrices {
                Time
                Price
            }
        }
    }
`;

export const LOGIN_USER = gql`
    mutation loginUserMutation($loginInput: UsersPermissionsLoginInput!) {
        login(input: $loginInput) {
            jwt
            user {
                confirmed
            }
        }
    }
`;
export const REGISTER_USER = gql`
    mutation registerUserMutation($registerInput: UsersPermissionsRegisterInput!) {
        register(input: $registerInput) {
            jwt
        }
    }
`;

export const REGISTER_USER_MOD = gql`
    mutation Mutation($customRegisterInput: CustomUsersPermissionsRegisterInput!) {
        customRegister(input: $customRegisterInput) {
            jwt
        }
    }
`;

export const GET_ME = gql`
    query getMe {
        self {
            email
            username
            id
            confirmed
            walletBalance
            Area
            Block
            Address
        }
    }
`;
export const DFINDTIMESLOT = gql`
    mutation FindTimesMutation($findTimesInput: DtimeRoomPayload!) {
        DfindTimes(input: $findTimesInput) {
            time
            room
        }
    }
`;
export const DFINDTIMESLOT3 = gql`
    mutation FindTimesMutation($findTimesInput: DtimeRoomPayload!) {
        DfindTimes3(input: $findTimesInput) {
            time
            room
        }
    }
`;
export const CREATE_ORDER = gql`
    mutation CreateOrderMutation($createOrderInput: createOrderInput) {
        createOrder(input: $createOrderInput) {
            order {
                id
            }
        }
    }
`;

export const GET_ORDER = gql`
    query getOrders($ordersWhere: JSON) {
        orders(where: $ordersWhere) {
            real_service {
                ServiceName
                ServiceCategory
                localizations {
                    ServiceName
                }
            }
            AppointmentDate
            AppointmentTime
            Duration
        }
    }
`;

export const CREATE_TRANSACTION = gql`
    mutation CreateTransactionMutation($createTransactionInput: createTransactionInput) {
        createTransaction(input: $createTransactionInput) {
            transaction {
                id
            }
        }
    }
`;

export const FINDTIMESLOT = gql`
    mutation FindTimesMutation($findTimesInput: timeRoomPayload!) {
        findTimes(input: $findTimesInput) {
            time
            room
        }
    }
`;

export const getRoomBlock = gql`
    query {
        roomBlock {
            room1
            room2
            room3
            room4
            room5
            room6
            room7
            room8
            room9
            room10
            room11
            room12
            room13
            room14
            room15
        }
    }
`;

export const GET_ORDER_TO_BOOK = gql`
    query GetOrdersToBook($ordersWhere: JSON) {
        orders(where: $ordersWhere, sort: "created_at:desc") {
            id
            Duration
            real_service {
                ServiceName
                ServiceCategory
                ServiceSubcategory
                localizations {
                    locale
                    ServiceName
                    ServiceDesc
                }
            }

            AppointmentDate
            AssignedRoom
            Amount
        }
    }
`;

export const BOOKROOM = gql`
    mutation BookRoomMutation($bookRoomInput: bookRoomPayload!) {
        bookRoom(input: $bookRoomInput) {
            id
            room
        }
    }
`;

export const SEARCH = gql`
    query SearchQuery($realServicesWhere: JSON) {
        realServices(where: $realServicesWhere) {
            id
            ServiceName
            slug
        }
    }
`;

export const PREFETCH_SEARCH = gql`
    query PrefetchedSearchQuery {
        realServices {
            id
            ServiceName
            slug
        }
    }
`;

export const FORGET_PASSWORD = gql`
    mutation forgotMutation($forgotPasswordEmail: String!) {
        forgotPassword(email: $forgotPasswordEmail) {
            ok
        }
    }
`;

export const CREATE_GIFT = gql`
    mutation CreateGiftMutation($createGiftInput: createGiftInput) {
        createGift(input: $createGiftInput) {
            gift {
                id
            }
        }
    }
`;

export const RESET_PASS = gql`
    mutation resetPasswordMutation(
        $resetPasswordPassword: String!
        $resetPasswordPasswordConfirmation: String!
        $resetPasswordCode: String!
    ) {
        resetPassword(
            password: $resetPasswordPassword
            passwordConfirmation: $resetPasswordPasswordConfirmation
            code: $resetPasswordCode
        ) {
            jwt
        }
    }
`;

export const GET_GIFT_COUNT = gql`
    query GetGiftCount {
        getGifts {
            gift
        }
    }
`;

export const Get_SubCategory_Images = gql`
    query {
        categoryImage {
            Body_Scrub {
                url
            }
            Club {
                url
            }
            Facial {
                url
            }
            Mani_Pedi {
                url
            }
            Massage {
                url
            }
            Nails {
                url
            }
            Packages {
                url
            }
            Specials {
                url
            }
            Sauna_Jacuzzi {
                url
            }
            Hamam {
                url
            }
            Product {
                url
            }
        }
    }
`;
