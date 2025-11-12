import { Gun, GunId, Difficulty, EnemyData } from "./types";

export const DIFFICULTY_LEVELS: Difficulty[] = [
    { id: 'easy', name: "Rookie", duration: 60, speedMultiplier: 0.8 },
    { id: 'medium', name: 'Contender', duration: 45, speedMultiplier: 1.0 },
    { id: 'hard', name: 'Champion', duration: 30, speedMultiplier: 1.5 },
];

export const BACKGROUNDS = [
    {
        id: 'ring',
        name: 'WWF Arena',
        imageUrl: 'https://i.postimg.cc/7PnQGtc3/f09ecd95-03e0-436e-81a0-df9f17fdb5fd.png'
    },
    {
        id: 'backyard',
        name: 'Backyard',
        imageUrl: 'https://i.postimg.cc/pdtMbXT8/76c9de53_1add_4408_8f1c_d0f5081e817d.png'
    },
    {
        id: 'bedroom',
        name: 'Kid\'s Bedroom',
        imageUrl: 'https://i.postimg.cc/J7pjVqC1/0489ef8c_7163_40ba_a94d_9cefbaae9441_1.png'
    }
];

export const GUNS: Record<GunId, Gun> = {
    nerf_gun: { // Handgun
        id: 'nerf_gun',
        imageUrl: 'https://i.postimg.cc/3yhhRt8D/gun.png',
        thumbUrl: 'https://i.postimg.cc/N22GTLWX/Handgun-Thumb.png',
        speed: 0.08,
        className: 'h-1/4',
        fireOffsetY: 0.85,
    },
    water_gun: { // Pink grenade launcher
        id: 'water_gun',
        imageUrl: 'https://i.postimg.cc/yJSwF5jm/Pink-Gernade.png',
        thumbUrl: 'https://i.postimg.cc/N9qZb4Cy/Pink-Gernade-Thumb.png',
        speed: 0.04,
        className: 'h-1/3',
        fireOffsetY: 0.8,
    },
    grenade_launcher: { // Green grenade launcher
        id: 'grenade_launcher',
        imageUrl: 'https://i.postimg.cc/sGGfS1tP/Bazooka.png',
        thumbUrl: 'https://i.postimg.cc/fSSWXk6V/Bazooka-Thumb.png',
        speed: 0.04,
        className: 'h-1/3',
        fireOffsetY: 0.8,
    }
};

const FIGURE_WIDTH = 15;
const FIGURE_HEIGHT = 25;
const STANDARD_HEADSHOT_RECT = { y: 0, height: 0.3 }; // Top 30% of the figure

export const ENEMY_DATA: EnemyData[] = [
    { id: 'andre', width: 18, height: 28, imageUrl: 'https://i.postimg.cc/yJDqQ28x/Andre-The-Giant.png', headshotRect: { y: 0, height: 0.25 } },
    { id: 'bambam', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/VSpx34JD/Bam-Bam.png', headshotRect: STANDARD_HEADSHOT_RECT },
    { id: 'bret', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/3yVsP9kf/Bret-Hart.png', headshotRect: STANDARD_HEADSHOT_RECT },
    { id: 'haku', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/phjwx8j3/Haku.png', headshotRect: STANDARD_HEADSHOT_RECT },
    { id: 'hillbilly', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/MMBCxRBC/Hillbilly-Jim.png', headshotRect: STANDARD_HEADSHOT_RECT },
    { id: 'honkytonk', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/dkCbvddD/Honky-Tonk-Man.png', headshotRect: STANDARD_HEADSHOT_RECT },
    { id: 'hogan', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/Vrtx1MMd/Hulk-Hogan.png', headshotRect: STANDARD_HEADSHOT_RECT },
    { id: 'sheik', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/ZBNGZ33r/Iron-Shiek.png', headshotRect: STANDARD_HEADSHOT_RECT },
    { id: 'jake', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/zH19fBSv/Jake-The-Snake.png', headshotRect: STANDARD_HEADSHOT_RECT },
    { id: 'snuka', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/mhQv5YB3/Jimmy-Snuka.png', headshotRect: STANDARD_HEADSHOT_RECT },
    { id: 'bundy', width: 18, height: 28, imageUrl: 'https://i.postimg.cc/dD8bx2wS/King-Kong-Bundy-Golden.png', headshotRect: { y: 0, height: 0.25 } },
    { id: 'macho', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/ppRwbmdb/Macho-Man.png', headshotRect: STANDARD_HEADSHOT_RECT },
    { id: 'mrt', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/rKMBXDw7/Mr-T.png', headshotRect: STANDARD_HEADSHOT_RECT },
    { id: 'piper', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/Yj15s6tK/Roddy-Piper.png', headshotRect: STANDARD_HEADSHOT_RECT },
    { id: 'warrior', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/mtBvfPrx/Ultimate-Warrior.png', headshotRect: STANDARD_HEADSHOT_RECT },
    { id: 'woody', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/8sv2RCgK/Woody.png', headshotRect: STANDARD_HEADSHOT_RECT },
    { id: 'rude', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/zX8f0T3D/Rick-Rude.png', headshotRect: STANDARD_HEADSHOT_RECT },
    { id: 'perfect', width: FIGURE_WIDTH, height: FIGURE_HEIGHT, imageUrl: 'https://i.postimg.cc/DS0j67pS/Mr-Perfect.png', headshotRect: STANDARD_HEADSHOT_RECT },
];
