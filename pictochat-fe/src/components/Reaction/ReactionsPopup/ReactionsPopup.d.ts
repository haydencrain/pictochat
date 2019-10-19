import * as React from 'react';
interface ReactionsPopupProps {
    /**
     * A callback function that fires when the popup trigger has been clicked
     * @function
     * @param { string } reactionName - The name of the reaction clicked
     */
    onClick: (reactionName: string) => void;
}
declare const _default: React.FunctionComponent<ReactionsPopupProps>;
export default _default;
