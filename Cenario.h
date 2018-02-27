#ifndef CENARIO_H
#define CENARIO_H

#include <allegro.h>
#include <list>

using namespace std;

enum eMatrixCode {mVazio , mParede, mComida, mBuraco};

struct Ponto
{
        int x;
        int y;
        int cor;
};

struct Buraco
{
        Ponto a;
        Ponto b;
};

class Cenario
{
        public:
                void load();
                void draw(BITMAP* buffer) const;
                void snakeComeu(int linha, int coluna);
                void unload();
                Cenario();
                virtual ~Cenario();
                eMatrixCode getCode(int linha, int coluna) const;
                Ponto getSaidaDoBuraco(int x, int y);
        protected:
        private:
                list<Buraco> buracos;
                void drawBuracosCor(BITMAP* buffer) const;
                void criarBuracos(list<Ponto>& pontos);
                void criarComida();
                eMatrixCode** matriz;
                BITMAP* paredeBitmap;
                BITMAP* vazioBitmap;
                BITMAP* comidaBitmap;
                BITMAP* buracoBitmap;

};

#endif // CENARIO_H
