/// <reference types="react" />
import { LeaderboardRank } from '../../../models/store/LeaderboardRank';
import './Leaderboard.less';
interface LeaderboardProps {
    ranks: LeaderboardRank[];
}
/**
 * A React component that displays a ranked list of users, ordered by the number of posts
 * @param { LeaderboardProps } props - The props of the component
 */
export declare function Leaderboard(props: LeaderboardProps): JSX.Element;
declare const _default: typeof Leaderboard;
export default _default;
