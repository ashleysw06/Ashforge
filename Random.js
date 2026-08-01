class Random {
    Chance(percentage) {
        return ( Math.random() * 100 < percentage );
    }

    HighestRandom(attempts) {
        let record = 0;

        for (let i = 0; i < attempts; i++) {
            let score = 0;

            while (Math.random() < 0.5) {
                score++;
            }

            if (score > record) {
                record = score;
            }
        }

        return record;
    }
}