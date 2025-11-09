import React, { useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import { actions } from "@store/common/reducer"
import { BodyContent, Content, HeadContent, Message, Title, Wrapper } from "./Alert.styles"
import { useDispatch, useSelector } from "react-redux"

const AlertContent = ({ message }) => {
    if (message) {
        return (
            <Content>
                <HeadContent>
                    <Title>Error</Title>
                </HeadContent>
    
                <BodyContent>
                    <Message>{ message }</Message>
                </BodyContent>
            </Content>
        )
    }
    return (<></>)
}

const Alert = () => {
    const { error } = useSelector((state) => state.common)
    const dispatch = useDispatch()

    useEffect(() => {
        if (error && error.message.length > 0) {
            toast.error(<AlertContent message={error.message} />, {
                position: "top-right",
                autoClose: 5_000,
                pauseOnFocusLoss: false,
                closeOnClick: true,
                draggable: true,
                theme: "colored",
                onOpen: () => dispatch(actions.resetError())
            })
        }
    }, [error?.message, dispatch])

    return (
        <Wrapper>
            <ToastContainer
                position="top-center"
                autoClose={10_000}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                theme="dark"
                className="alert"
                />
        </Wrapper>
    )
}

export default Alert
