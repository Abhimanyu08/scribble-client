const paintReducer = (state, action) => {

    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload
            }
        case 'SET_OWNER':
            return {
                ...state,
                owner: action.payload
            }
        
        case 'SET_COLOR':
            return {
                ...state,
                color: action.payload
            }
        
        case 'SET_TOOL':
            return {
                ...state,
                tool: action.payload
            }
        
        case 'SET_PICTURE':
            console.log("new picture");
            return {
                ...state,
                picture: action.payload
            }

        case 'SET_SIZE':
            return {
                ...state,
                size: action.payload
            }

        case 'SET_ROOM':
            return {
                ...state,
                roomId: action.payload
            }

        case 'SET_SOCKET':
            return {
                ...state,
                socket: action.payload
            }
        case 'SET_DRAWER':
            return {
                ...state,
                currentDrawer: action.payload
            }
        case 'SET_ACTIVE':
            return {
                ...state,
                active: action.payload
            }
        case 'SET_TIME':
            return {
                ...state,
                time: action.payload
            }
        case 'SET_ROUNDS':
            return {
                ...state,
                rounds: action.payload
            }
        default:
            return state
    } 

}

export default paintReducer