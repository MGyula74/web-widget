import { h, Component } from 'preact';
import {botman} from './botman';
import { IAction, IMessage } from '../typings';


export default class ChatAction extends Component<IChatActionProps, any> {

    render(props: IChatActionProps) {
        return (
            <div class="btn" onClick={() => this.performAction(props.action)}>
                {props.action.text}
            </div>
        );
    }

    performAction(action: IAction) {
        this.props.messageHandler({
            text: action.text,
            type: 'text',
            from: 'visitor'
        });

        botman.callAPI(action.value, true, null, (msg: IMessage) => {
            this.props.messageHandler({
                text: msg.text,
                type: msg.type,
                elements: msg.elements,
                buttons: msg.buttons,
                actions: msg.actions,
                attachment: msg.attachment,
                additionalParameters: msg.additionalParameters,
                from: 'chatbot'
            });
        }, null);
    }
}

interface IChatActionProps {
    messageHandler: Function,
    action: IAction,
}