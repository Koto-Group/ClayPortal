import { createInviteToken, hashInviteToken } from "@/lib/security/invite-tokens";

describe("invite tokens", () => {
  it("creates stable hashes for the same token", () => {
    const token = createInviteToken();
    expect(hashInviteToken(token)).toBe(hashInviteToken(token));
  });

  it("creates different hashes for different tokens", () => {
    expect(hashInviteToken(createInviteToken())).not.toBe(
      hashInviteToken(createInviteToken())
    );
  });
});
