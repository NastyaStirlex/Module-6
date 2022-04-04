#include "Network.h"
#include <chrono>

struct data_info {
	double* pixels;
	int digit;///цифры пиксели к ним
};

data_Network ReadDataNetwork(string path) {
	data_Network data();
	ifstream fin;
	fin.open(path);
	if (!fin.is_open()) {
		cout << "Error reading the file" << path << endl;
		system("pause");
	}
	else
		cout << path << "loading...\n";//config
	string tmp;
	int L;
	while (!fin.eof()) {
		fin >> tmp;
		if (tmp == "Network") {
			fin >> L;
			data.L = L;
			data.size = new int[L];
			for (int i = 0; i < L; i++) {
				fin >> data.size[i];
			}
		}
	}
	fin.close();
	return data;
}

data_info* ReadData(string path, const data_Network& data_NM, int& examples) {
	data_info* data;
	ifstream fin;
	fin.open(path);
	if (!fin.is_open()) {
		cout << "Error reading the file" << path << endl;
		system("pause");
	}
	else
		cout << path << "loading...\n";//config
	string tmp;
	fin >> tmp;
	if (tmp == "Examples") {
		fin >> examples;//сколько обуч цифр
		cout << "Examples:" << examples << endl;
		data = new data_info[examples];
		for (int i = 0; i < examples; ++i)
			data[i].pixels = new double[data_NM.size[0]];

		for (int i = 0; i < examples; ++i) {
			fin >> data[i].digit;
			for (int j = 0; j < data_NM.size[0]; ++j) {
				fin >> data[i].pixels[j];
			}
		}
		fin.close();
		cout << "lib_MNIST loaded... \n";
		return data;
	}
	else {
		cout << "Error loading: " << path << endl;
		fin.close();
		return nullptr;
	}
}

int main() 
{
	Network NW{};
	data_Network NW_config;
	data_info* data;
	double ra = 0, right, predict, maxra = 0;//right answer
	int epoch = 0;
	bool study, repeat = true;
	chrono::duration<double> time;

	NW_config = ReadDataNetwork("Config.txt");
	NW.Init(NW_config);
	NW.PrintConfig();//вывод конфигурации нейросети
	
	while (repeat) {
		cout << "STUDY?(1/0)" << endl;
		cin >> study;
		if (study) {
			int examples;
			data = ReadData("lib_MNIST_edit.txt", NW_config, examples);
			auto begin = chrono::steady_clock::now();
			while (ra / examples * 100 < 100) {//хотим 100% но реальность
				ra = 0; auto t1 = chrono::steady_clock::now();
				for (int i = 0; i < examples; ++i) {
					NW.SetInput(data[i].pixels);
					right = data[i].digit;//правильная цифра
					predict = NW.ForwardFeed();//которую получили
					if (predict != right) {
						NW.BackPropogation(right);//дельты
						NW.WeightsUpdater(0.15 * exp(-epoch / 20.));//экспоненциальное затухание
					}
					else ra++;
				}
				auto t2 = chrono::steady_clock::now();
			//библиотека "времени"
				time = t2 - t1;
				if (ra > maxra) maxra = ra;
				cout << "ra: " << ra / examples * 100 << "\t" << "maxra: " << maxra / examples * 100;
				epoch++;
				if (epoch == 20)
					break;
			}
			auto end = chrono::steady_clock::now();
			time = end - begin;
			cout << "TIME: " << time.count() / 60. << "min" << endl;
			NW.SaveWeights();
		}
		else { NW.ReadWeights(); }//если обучилась
	}
	cout << "TEST? (1/0)\n";
	bool test_flag;
	cin >> test_flag;
	if (test_flag) 
	{
		int ex_tests;
		data_info* data_test;
		data_test = ReadData("lib_10k.txt", NW_config, ex_tests);//проверочные
		ra = 0;
		for (int i = 0; i < ex_tests; ++i) {
			NW.SetInput(data_test[i].pixels);
			predict = NW.ForwardFeed();
			right = data_test[i].digit;
			if (right == predict)
				ra++;
		}
		cout << "RA: " << ra / ex_tests * 100 << endl;
	}
	cout << "Repeat? (1/0)\n";
	cin >> repeat;
	system("pause");
	return 0;
}




