import Raven from 'raven-js';

//Logging unexpected errors to sentry logger service provider
function init() {
    Raven.config(
        'https://0c624ffde9a54eec80e222e3143da763@o829375.ingest.sentry.io/5811995',
        {
            release: '1-0-0',
            environment: 'development-test',
        }
    ).install();
}

function log(error) {
    Raven.captureException(error);
}

const exportedObject = {
    init,
    log,
};

export default exportedObject;
