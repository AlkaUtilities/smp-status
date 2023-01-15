export default {
    port: 8080,

    debug: true,

    smp: {
        ip: "indihomeSMP.aternos.me",
        port: 36341,
    },

    status: {
        channel: "1061088148286877748", // channel id
        updateInterval: 5, // in seconds
    },

    icons: {
        author: undefined,

        online: "https://cdn.discordapp.com/attachments/806420483184656404/1061272335220490301/WH6bvW0IMW7GQw4w.png",
        offline:
            "https://cdn.discordapp.com/attachments/806420483184656404/1061272334830415912/HP0UQKiN0OpNZQBd.png",

        preparing:
            "https://cdn.discordapp.com/attachments/806420483184656404/1061273219983757332/LsjEO4k52BQkJ4Fi.png",
        loading:
            "https://cdn.discordapp.com/attachments/806420483184656404/1061273219983757332/LsjEO4k52BQkJ4Fi.png",
        stopping:
            "https://cdn.discordapp.com/attachments/806420483184656404/1061273219983757332/LsjEO4k52BQkJ4Fi.png",
        saving: "https://cdn.discordapp.com/attachments/806420483184656404/1061273219983757332/LsjEO4k52BQkJ4Fi.png",
        unreachable:
            "https://cdn.discordapp.com/attachments/806420483184656404/1061272334830415912/HP0UQKiN0OpNZQBd.png",
    },

    colors: {
        unreachable: "f62424",
        offline: "f62424",

        online: "1fd78d",

        preparing: "a4a4a4",
        loading: "a4a4a4",
        stopping: "a4a4a4",
        saving: "a4a4a4",
    },
};
