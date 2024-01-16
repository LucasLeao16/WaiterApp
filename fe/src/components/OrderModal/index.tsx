import { useEffect } from 'react';
import closeIcon from '../../assets/images/close-icon.svg';
import { Order } from '../../types/Order';
import { formatCurrency } from '../../utils/formatCurrency';
import { Actions, ModalBody, OrderDetails, Overlay } from './styles';
interface OrderModalProps {
    visible: boolean;
    order: Order | null;
    onClose: () => void;
    onCancelOrder: () => Promise<void>;
    isLoading: boolean;
    onChangeOrderStatus: () => void;
}

export function OrderModal({
    visible,
    order,
    onClose,
    onCancelOrder,
    isLoading,
    onChangeOrderStatus,
}: OrderModalProps) {
    useEffect(() => {
        function handleKeyDowm(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }
        document.addEventListener('keydown', handleKeyDowm);
        return () => {
            document.removeEventListener('keydown', handleKeyDowm);
        };
    }, [onClose]);

    if (!visible || !order) {
        return null;
    }
    const total = order.products.reduce((total, { product, quantity }) => {
        return total + product.price * quantity;
    }, 0);
    return (
        <Overlay>
            <ModalBody>
                <header>
                    <strong>Mesa {order.table}</strong>
                    <button type="button" onClick={onClose}>
                        <img src={closeIcon} alt="Ícone de fechar" />
                    </button>
                </header>

                <div className="status-container">
                    <small>Status do Pedido</small>
                    <div>
                        <span>
                            {order.status === 'WAITING' && '🕑'}
                            {order.status === 'IN_PRODUCTION' && '👨‍🍳'}
                            {order.status === 'DONE' && '✅'}
                        </span>
                        <strong>
                            {order.status === 'WAITING' && 'Fila de Espera'}
                            {order.status === 'IN_PRODUCTION' &&
                                'Em preparação'}
                            {order.status === 'DONE' && 'Pronto'}
                        </strong>
                    </div>
                </div>

                <OrderDetails>
                    <strong>Itens</strong>
                    <div className="order-items">
                        {order.products.map(({ _id, product, quantity }) => (
                            <div className="item" key={_id}>
                                <img
                                    src={`http://localhost:3001/uploads/${product.imagePath}`}
                                    alt={product.name}
                                    width="48"
                                    height="24.43"
                                />
                                <span className="quantity">{quantity}x</span>
                                <div className="product-details">
                                    <strong>{product.name}</strong>
                                    <span>{formatCurrency(product.price)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="total">
                        <span>total</span>
                        <strong>{formatCurrency(total)}</strong>
                    </div>
                </OrderDetails>
                <Actions>
                    {order.status !== 'DONE' && (
                        <button
                            type="button"
                            className="primary"
                            disabled={isLoading}
                            onClick={onChangeOrderStatus}
                        >
                            <span>{order.status === 'WAITING' && '👨‍🍳'}</span>
                            <span>
                                {order.status === 'IN_PRODUCTION' && '✅'}
                            </span>
                            <strong>
                                {order.status === 'WAITING' &&
                                    'Iniciar Produção'}
                                {order.status === 'IN_PRODUCTION' &&
                                    'Concluir Pedido '}
                            </strong>
                        </button>
                    )}

                    <button
                        type="button"
                        className="secundary"
                        onClick={onCancelOrder}
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                </Actions>
            </ModalBody>
        </Overlay>
    );
}