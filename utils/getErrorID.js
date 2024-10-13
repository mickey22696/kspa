export default function getErrorIDfromStrapi(error) {
    let errorMessageID;
    try {
        errorMessageID =
            error.graphQLErrors[0].extensions.exception.data.message[0].messages[0];
        return errorMessageID;
    } catch (e) {
        console.error('Got an error trying to handle graphQLError', e, ' => ', error);
        return e;
    }
}
