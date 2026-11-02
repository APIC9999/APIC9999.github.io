# APIC 실험실 장비예약

Firebase(Firestore)로 실시간 동기화하고 GitHub Pages로 배포하는 단일 파일 웹페이지.

## 파일 구성
| 파일 | 용도 |
|---|---|
| `index.html` | 앱 전체 (상단 `firebaseConfig`만 수정) |
| `firestore.rules` | Firestore 보안 규칙 (콘솔에 붙여넣거나 CLI로 배포) |
| `firebase.json` | Firebase CLI 배포 설정 (선택) |

## 1단계. Firebase 프로젝트 만들기
1. https://console.firebase.google.com → **프로젝트 추가** (Google 애널리틱스는 꺼도 됨)
2. 왼쪽 **빌드 → Firestore Database → 데이터베이스 만들기**
   - 위치: `asia-northeast3 (서울)` (생성 후 변경 불가)
   - 모드: **프로덕션 모드로 시작** (규칙은 아래에서 교체)
3. **규칙** 탭 → `firestore.rules` 내용 전체를 붙여넣고 **게시**
4. **프로젝트 설정(톱니) → 일반 → 내 앱 → 웹(`</>`)** 앱 등록 → 표시되는 `firebaseConfig` 복사
5. `index.html` 상단의 아래 4개 값을 교체
   ```js
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...firebaseapp.com",
     projectId: "...",
     appId: "..."
   };
   ```
   - 웹 API 키는 공개되어도 되는 값임 (접근 제어는 Firestore 규칙 담당)
   - Authentication, Storage는 사용하지 않으므로 설정 불필요

## 2단계. GitHub Pages 배포
1. GitHub에서 새 저장소 생성 (예: `apic-reservation`, Public 권장)
2. 이 폴더의 파일을 업로드 (웹에서 **Add file → Upload files**, 또는 git push)
   ```bash
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/<계정>/<저장소>.git
   git push -u origin main
   ```
3. 저장소 **Settings → Pages → Build and deployment**
   - Source: `Deploy from a branch`
   - Branch: `main` / `/ (root)` → Save
4. 1~2분 후 `https://<계정>.github.io/<저장소>/` 접속
   - Private 저장소는 GitHub Pages 플랜 조건에 따라 제한될 수 있음

## 3단계. 최초 설정 (배포 직후 1회)
1. 접속 → 로그인 화면 하단 **관리자 모드** → 코드 `9999` 입력
   - 이때 기본 장비 탭 13개(SEM ~ 웨이퍼본더, 신뢰성방)가 자동 생성됨
2. 계정 추가: 이름 + 숫자 4자리 PIN (약 20명 등록)
3. 창을 닫고 본인 계정으로 로그인 → 동작 확인
4. 접속 주소를 구성원에게 공유

## (선택) Firebase Hosting으로도 배포
GitHub Pages 대신 Firebase로 호스팅하려면:
```bash
npm i -g firebase-tools
firebase login
firebase use --add            # 1단계 프로젝트 선택
firebase deploy               # 규칙 + 호스팅
firebase deploy --only firestore:rules   # 규칙만 갱신할 때
```

## 사용 규칙
- 로그인: 이름 + 숫자 4자리 PIN, 한 번 로그인하면 유지, 다른 기기에서도 동일 이름/PIN 사용
- 일반 사용자: 빈 칸 클릭 = 예약, 내 예약 클릭 = 즉시 삭제, 타인 예약 칸은 클릭 불가, 관리 창에서 본인 PIN만 변경
- 관리자 모드(코드 `9999`): 장비 탭·열 추가/삭제, 계정 추가/PIN 초기화/삭제, 모든 예약 삭제, "수리" 버튼으로 수리중 예약
- 표시 범위: 오늘 포함 22일, 자정이 지나면 맨 윗줄이 사라지고 아래 줄이 올라옴
- 신뢰성방: 사용자 칸 클릭으로 등록/해제, 시작·종료 시간은 날짜 선택, 비고는 직접 입력

## 관리자 코드 변경
`index.html` 상단의 `const ADMIN_CODE = "9999";` 값을 수정 후 다시 업로드.

## 보안 참고
- 관리자 코드와 권한 구분은 화면(앱) 수준이며, 소스를 열면 코드 확인 가능
- 연구실 내부 공유용으로는 충분하나, 외부 공개 서비스로 쓰려면 Firebase Authentication 기반으로 전환 필요
- PIN은 해시로 저장되지만 4자리 숫자 특성상 규칙을 아는 사람이 직접 DB를 읽으면 추측 가능하므로 중요한 용도에는 쓰지 않을 것
