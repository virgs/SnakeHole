#ifndef SNAKE_H
#define SNAKE_H

#include <allegro.h>
#include <list>
#include "Cenario.h"
#include "Jogo.h"

using namespace std;

enum eDirecao {dCima, dDireita, dBaixo, dEsquerda};

struct Celula
{
        int x;
        int y;
        BITMAP* imagem;
        static BITMAP* imagemFromDirecao(eDirecao atual, eDirecao anterior);
        static BITMAP* iHorizontal;
        static BITMAP* iVertical;
        static BITMAP* iCabeca;
        static BITMAP* iEsqCima;
        static BITMAP* iEsqBaixo;
        static BITMAP* iDirCima;
        static BITMAP* iDirBaixo;
        static void load();
        static void unload();
};

class Snake
{
        public:
                Snake();
                virtual ~Snake();
                void draw(BITMAP* buffer) const;
                void update(bool update, Cenario* cenario);
                void load();
                void unload();
                bool isAlive() const;
                unsigned int getPontuacao() const;
                static int initialPointX;
                static int initialPointY;
        protected:
        private:
                void input();
                void selfCollision();

                list<Celula> corpo;
                eDirecao direcao, direcaoAnterior, futuraDirecao;
                BITMAP* imagem;
                BITMAP* imagemCabeca;
                bool alive;
                unsigned int pontuacao;
};

#endif // SNAKE_H
