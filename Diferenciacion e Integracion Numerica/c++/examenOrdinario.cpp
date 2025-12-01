#include <iostream>
#include <fstream>
#include <vector>
#include <cmath>
#include <iomanip>

double f(double x, double y){
    return 1.0 + y / x;
}

double exact(double x){
    return x * std::log(x);
}

int main(){
    const double a = 1.0;
    const double b = 5.0;
    const double h = 0.4;
    const int N = int((b - a) / h + 0.5); // expect 10
    std::vector<double> x(N+1);
    for(int i=0;i<=N;++i) x[i] = a + i*h;

    // storage for methods
    std::vector<double> we(N+1), wt2(N+1), wt3(N+1), wt4(N+1), wm(N+1), wme(N+1), wh(N+1), wrk4(N+1);

    // initial condition y(1)=0
    we[0]=wt2[0]=wt3[0]=wt4[0]=wm[0]=wme[0]=wh[0]=wrk4[0]=0.0;

    // iterate
    for(int i=0;i<N;++i){
        double xi = x[i];
        // Euler
        we[i+1] = we[i] + h * f(xi, we[i]);

        // Taylor coefficients using derived derivatives:
        double ypp = 1.0 / xi;            // y''(xi)
        double yppp = -1.0 / (xi*xi);     // y'''(xi)
        double y4 = 2.0 / (xi*xi*xi);     // y''''(xi)

        wt2[i+1] = wt2[i] + h * f(xi, wt2[i]) + (h*h/2.0) * ypp;
        wt3[i+1] = wt3[i] + h * f(xi, wt3[i]) + (h*h/2.0) * ypp + (h*h*h/6.0) * yppp;
        wt4[i+1] = wt4[i] + h * f(xi, wt4[i]) + (h*h/2.0) * ypp + (h*h*h/6.0) * yppp + (h*h*h*h/24.0) * y4;

        // Midpoint
        double k1m = f(xi, wm[i]);
        double y_mid = wm[i] + (h/2.0)*k1m;
        wm[i+1] = wm[i] + h * f(xi + h/2.0, y_mid);

        // Modified Euler (as in apuntes)
        double fi = f(xi, wme[i]);
        double pred = wme[i] + h * fi;
        wme[i+1] = wme[i] + (h/2.0) * ( fi + f(xi + h, pred) );

        // Heun (3-stage variant from apuntes)
        double k1 = (h/3.0) * f(xi, wh[i]);
        double k2 = (2.0*h/3.0) * f(xi + h/3.0, wh[i] + k1);
        wh[i+1] = wh[i] + (h/4.0) * ( f(xi, wh[i]) + 3.0 * f(xi + 2.0*h/3.0, wh[i] + k2) );

        // RK4
        double K1 = h * f(xi, wrk4[i]);
        double K2 = h * f(xi + h/2.0, wrk4[i] + K1/2.0);
        double K3 = h * f(xi + h/2.0, wrk4[i] + K2/2.0);
        double K4 = h * f(xi + h, wrk4[i] + K3);
        wrk4[i+1] = wrk4[i] + (K1 + 2.0*K2 + 2.0*K3 + K4) / 6.0;
    }

    // output CSV
    std::ofstream of("results.csv");
    of << std::setprecision(10) << std::fixed;
    of << "x,exact,euler,taylor2,taylor3,taylor4,midpoint,modified_euler,heun,rk4\n";
    std::cout << std::setprecision(10) << std::fixed;
    std::cout << "x,exact,euler,taylor2,taylor3,taylor4,midpoint,modified_euler,heun,rk4\n";
    for(int i=0;i<=N;++i){
        double ex = exact(x[i]);
        of << x[i] << "," << ex << "," << we[i] << "," << wt2[i] << "," << wt3[i] << "," << wt4[i]
           << "," << wm[i] << "," << wme[i] << "," << wh[i] << "," << wrk4[i] << "\n";
        std::cout << x[i] << "," << ex << "," << we[i] << "," << wt2[i] << "," << wt3[i] << "," << wt4[i]
           << "," << wm[i] << "," << wme[i] << "," << wh[i] << "," << wrk4[i] << "\n";
    }
    of.close();
    std::cout << "\nWrote results.csv\n";
    return 0;
}