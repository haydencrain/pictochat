/// <reference types="react" />
import { SockPuppetAlert } from '../../models/store/SockPuppetAlert';
interface SockPuppetAlertProps {
    alert: SockPuppetAlert;
}
/**
 * A React component that renders the display for a sock puppet alert, and lists the users of the device
 * @component
 */
declare function SockPuppetItem(props: SockPuppetAlertProps): JSX.Element;
export default SockPuppetItem;
