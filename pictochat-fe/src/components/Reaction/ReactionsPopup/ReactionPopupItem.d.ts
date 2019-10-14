import React from 'react';
interface ReactionPopupItemProps {
    icon: string;
    onClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}
export default function ReactionPopupItem(props: ReactionPopupItemProps): JSX.Element;
export {};
