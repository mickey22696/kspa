import PickDate from './pickDate';
import PaymentMethod from './paymentMethod';
import useSide from '../../context/SidebarFlow';
export default function BookNow() {
    const { pickdate } = useSide();
    return <>{pickdate ? <PickDate /> : <PaymentMethod />}</>;
}
