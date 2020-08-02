#ifndef JOGO_H
#define JOGO_H

#include "Cenario.h"
#include "Snake.h"
#include <time.h>

#define TILE_DIMENSAO 10

class Cenario; //Forward declaration
class Snake; // Declaração prévia, necessária quando uma classe A inclui uma classe B, e a classe B inclui a classe A

class Jogo
{
        public:
                void run();
                static Jogo* getInstance();
                static int LINHAS;
                static int COLUNAS;
        protected:
        private:
                Jogo();
                virtual ~Jogo();
                void initialize();
                void load();
                void gameLoop();
                void unload();
                void update();
                void draw();
                double somaAcumulada;
                double UPDATE_TIME;
                static Jogo* instance;
                BITMAP* buffer;
                clock_t start;
                Cenario* cenario;
                Snake* snake;
};

#endif // JOGO_H
