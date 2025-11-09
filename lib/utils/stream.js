/**
 * Aguarda a conclusão de um stream (leitura ou escrita)
 * @param {Stream} stream - Stream a ser aguardado
 * @returns {Promise<Stream>} Promise que resolve quando o stream termina
 */
module.exports = (stream) => {
  return new Promise((resolve, reject) => {
    let resolved = false;

    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        stream.removeAllListeners('finish');
        stream.removeAllListeners('close');
        stream.removeAllListeners('end');
        stream.removeAllListeners('error');
      }
    };

    const handleSuccess = () => {
      cleanup();
      resolve(stream);
    };

    const handleError = (error) => {
      cleanup();
      reject(error);
    };

    // Para WriteStream, usar 'finish' (indica que todos os dados foram escritos)
    stream.on('finish', handleSuccess);

    // Para fallback em alguns streams que não emitem 'finish'
    stream.on('close', handleSuccess);

    // Para ReadableStream, usar 'end'
    stream.on('end', handleSuccess);

    // Captura erros
    stream.on('error', handleError);
  });
};
