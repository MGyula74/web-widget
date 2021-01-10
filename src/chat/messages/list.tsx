import { h, Component } from 'preact';
import { botman } from '../botman';
import MessageType from "./messagetype";
import { IButton, IMessage, IMessageTypeProps } from '../../typings';

export default class ListType extends MessageType {

    getButton(button: IButton) {
        if (button.type === 'postback') {
            return <div class="btn" onClick={() => this.performAction(button)}>
                {button.title}
            </div>;
        }
        if (button.type === 'web_url') {
            return <a class="btn" href={button.url} target="_blank">{button.title}</a>;
        }
    }

    render(props: IMessageTypeProps) {
        const message = props.message;
        const carouselId = Math.floor(Math.random() * 10000);

        const caorusel = message.elements.map((element, idx) => {
            const elementButtons = element.buttons ? element.buttons.map((button: IButton) => {
                return this.getButton(button);
            }) : '';

            const nextId = idx === message.elements.length - 1 ? 1 : idx + 2;
            const prevId = idx === 0 ? message.elements.length : idx;
            const slideId = carouselId + "_carousel__slide" + (idx + 1);
            const nextIdStr = "#" + carouselId + "_carousel__slide" + nextId;
            const prevIdStr = "#" + carouselId + "_carousel__slide" + prevId;
            let img = <div></div>;

            if (element.image_url) {
                img = <img src={element.image_url} style={{ maxWidth: '100%', maxHeight: '100%' }} />;
            }

            let snapper;
            if (message.elements.length > 1) {
                snapper = <div class="carousel__snapper">
                            <a href={prevIdStr}
                                class="carousel__prev">Előre</a>
                            <a href={nextIdStr}
                                class="carousel__next">Hátra</a>
                        </div>;
            } else {
                snapper = '';
            }

            return <li id={slideId}
                        tabIndex={0}
                        class="carousel__slide">
                            <div style={{ minWidth: '200px', minHeight: '150px', position: 'relative', width: '100%', height: '100%', padding: '5px' }}>
                                <div style={{ minHeight: '150px' }}>
                                {img}
                                <h4 style={{ margin: '2px 0px' }}>{element.title}</h4>
                                <p style={{ whiteSpace: 'pre-line' }}>{element.subtitle}</p>
                                </div>
                                <div style={{ left: 0, right: 0, bottom: 0}}>
                                    {elementButtons}
                                </div>
                            </div>
                        {snapper}
                    </li>;

        });

        let navigator;
        if (message.elements.length > 1) {
            const bullets = message.elements.map((_element, idx) => {
                const slideId = "#" + carouselId + "_carousel__slide" + (idx + 1);
                return <li class="carousel__navigation-item">
                            <a href={slideId}
                                class="carousel__navigation-button">Ugrás {idx + 1}. lapra</a>
                        </li>;
            });
    
            navigator = 
            <aside class="carousel__navigation">
                <ol class="carousel__navigation-list">
                    { bullets }
                </ol>
            </aside>
        }

        return (
            <section class="carousel" aria-label="Gallery">
                <ol class="carousel__viewport">
                    {caorusel}
                </ol>
                {navigator}
            </section>
        );
    }

    performAction(button: IButton) {
        this.props.messageHandler({
            text: button.title,
            type: 'text',
            from: 'visitor'
        });

        botman.callAPI(button.payload, true, null, (msg: IMessage) => {
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
