#!/usr/bin/env bash
# TDD hook — PostToolUse(Write|Edit)
#
# .ts/.tsx 파일을 Edit/Write 하면 vitest 전체 스위트를 자동 실행한다.
# - 통과: 조용히 exit 0 (간단한 확인 메시지만)
# - 실패: 실패 로그를 stderr로 내보내고 exit 2 → Claude에게 피드백되어
#         곧바로 고치도록 유도된다 (Red → Green 루프).
#
# 입력(stdin): PostToolUse hook JSON  예) {"tool_input":{"file_path":"lib/x.ts"}}
set -uo pipefail

# 프로젝트 루트: Claude Code가 주는 env var 우선, 없으면 스크립트 위치(.claude/hooks)에서 역산
ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_response.filePath // empty')

# 대상이 .ts/.tsx 가 아니면 조용히 통과 (md/json/css 등은 무시)
case "$file" in
  *.ts | *.tsx) ;;
  *) exit 0 ;;
esac

cd "$ROOT" || exit 0

# 이 프로젝트는 테스트 스위트가 작고 빠르므로 전체를 실행한다.
output=$(npx vitest run 2>&1)
status=$?

if [ "$status" -ne 0 ]; then
  {
    echo "❌ TDD hook: '$file' 수정 후 vitest가 실패했습니다. 아래 실패부터 고친 뒤 진행하세요."
    echo "------------------------------------------------------------"
    printf '%s\n' "$output" | tail -n 40
  } >&2
  exit 2
fi

echo "✅ TDD hook: vitest 통과 ($(basename "$file"))"
exit 0
