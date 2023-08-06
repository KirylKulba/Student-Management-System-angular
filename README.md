# Student-Management-System-angular

I have been working on this project as part of my web development course, focusing on scripting languages and gained hands-on practice with Angular framework.
Right below you can find a description of the system in polish language.

# Kurs:Języki Skryptowe (Informatyka Stosowana 4 semestr)

# Temat

System obsługi studentów

# Cel

Celem projektu było zaprojektowanie aplikacji webowej umożliwiającej przygotowywanie oferty dydaktycznej (kierunki, kursy, oceny, prowadzący), obsługę toku studiów (kursy, oceny) wszystkich rodzajów i poziomów (jednolite, magisterskie, podyplomowe) itd., itp.

# Opisanie

System Obsługi Studentów jest oprogramowaniem do zarządzania i udostępniania danych (informacji) związanych ze studiowaniem, służącym wszystkim prowadzącym, studentom oraz administracji. System ten umożliwia m.in. zdalne załatwianie spraw związanych z tokiem studiów, w których w tradycyjnej formie musiały pośredniczyć dziekanaty oraz inne instytucje. Do przygotowania oferty dydaktycznej w bazie powinna znajdować się informacja o:

- prowadzących i studentach
- kierunkach i ich kursach
- ocen studentów
  Dla studentów system jest zbiorem informacji, który gwarantuje dostęp do kursów i sprawdzenie uzyskanych ocen z egzaminów. Dane osobowe każdego studenta mogą zostać zaimportowane z przez każdego użytkownika, który ma uprawnienia pracownika uczelni albo administratora. Jest możliwość dodawania wielu studentów na raz za pomocą tabel CSV.
  W systemie znajduje się także aktualna oferty dydaktyczne uczelni.

# Zakres

Aplikacja umożliwia gromadzenie, wyszukiwanie, czytelne prezentowanie danych dotyczącej kierunków, kursów oraz studentów uczelni.

# Użyte technologie

Decyzja o użyciu przedstawionych poniżej technologii w implementacji aplikacji padła głównie ze względu na zainteresowania autora projektu. Dodatkowym czynnikiem determinującym wybór technologii była licencja określająca sposoby możliwej dystrybucji produktów. Autorowi zależało na tym aby używać rozwiązań:

- ogólnodostępnych
- popularnych
- darmowych
- o otwartym kodzie źródłowym
- mających społeczność wzajemnie sobie pomagających użytkowników

Wyżej wymienione cechy gwarantują szybkie rozwiązywanie ewentualnych problemów. Co więcej produkty tego typu są aktywnie i dynamicznie rozwijane co dobrze rokuje na dalszy rozwój aplikacji. Poniżej znajduje się lista z technologiami realizującymi poszczególne warstwy aplikacji.

- Spring Boot
- Spring Data
- Spring Security
- Spring WebSocket
- Twitter Bootstrap
- MySql
- Angular

# Użytkownicy i uprawnienia

- Gość – rejestracja oraz logowanie do systemu.
- Student – przeglądanie swoich kursów (ocen wystawionych za te kursy), przeglądanie kursów na które student musi zapisać się (możliwość zapisywania się na te kursy), przeglądanie kursów przyszłych semestrów oraz historii zaliczeń poprzednich semestrów, otrzymywanie komunikatów o wystawieniu ocen, zapisywania się na kurs albo wypisywania się z kursu, edycja swoich danych.
- Pracownik uczelni (prowadzący) – zapisywanie studentów na kursy oraz wypisywanie, wystawienie zaliczeń oraz ich edycji.
- Administrator – dodawanie, edycja, usuwanie kursów, kierunków, studentów, nadawanie uprawnień użytkownikom systemu oraz uprawnienia użytkowników wymienione wyżej.

# Elementy zrealizowane podczas tego kursu

- UI
- Logowanie i rejestracja
- CRUD operacje dla kierunków, kursów, studentów.
- Nadawanie uprawnień użytkownikom
- Zapisywanie się na kursy oraz wypisywanie się
- Wystawienie ocen
- Wysyłanie komunikatów o wystawieniu oceny oraz o zapisywaniu albo wypisywaniu na kursy
- Dodawanie wielu studentów oraz utworzenie wielu kont użytkowników na raz
- Możliwość reklamacji komunikatu o ocenie

# Efekty końcowe

Implementacja pozwoliła mi dokładnie poznać wiele nowoczesnych technologii. Dała też doświadczenie, które będę mógł wykorzystać w kolejnych projektach w trakcie mojej dalszej edukacji i kariery zawodowej. Czas poświęcony na tę pracę uświadomił mi, jak istotny jest sam proces projektowy i z pewnością wpłynie na lepsze decyzje projektowe podejmowane w przyszłości. Efekt końcowy uznaję za bardzo zadowalający, a samo doświadczenie oceniam jako bezcenne.
